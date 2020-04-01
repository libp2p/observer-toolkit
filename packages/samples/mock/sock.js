'use strict'

const http = require('http')
const WebSocket = require('ws')
const {
  proto: { ClientSignal },
} = require('@libp2p-observer/proto')
const { DEFAULT_SNAPSHOT_DURATION } = require('./utils')
const {
  generateConnections,
  generateConnectionEvents,
  generateDHT,
  generateRuntime,
  generateState,
  generateVersion,
  updateConnections,
  updateDHT,
} = require('./generate')

const connections = []
const version = generateVersion()
const server = http.createServer()
const wss = new WebSocket.Server({ noServer: true })

const msgQueue = []

let lastDurationSnapshot
let lastCutoffSeconds
let runtime
let dht

function generateMessages({
  connectionsCount,
  duration: durationSnapshot,
  peersCount,
  cutoffSeconds,
}) {
  const utcNow = Date.now()
  const utcFrom = utcNow
  const utcTo = utcNow + durationSnapshot
  if (!dht) dht = generateDHT({ peersCount })

  if (
    !runtime ||
    lastDurationSnapshot !== durationSnapshot ||
    cutoffSeconds !== lastCutoffSeconds
  ) {
    runtime = generateRuntime({
      stateIntervalDuration: durationSnapshot,
      cutoffSeconds,
    })
    lastDurationSnapshot = durationSnapshot
    lastCutoffSeconds = cutoffSeconds
  }

  if (!connections.length) {
    connections.length = 0
    const conns = generateConnections(
      connectionsCount,
      utcNow - durationSnapshot
    )
    updateConnections(conns, null, utcFrom, durationSnapshot, cutoffSeconds)
    connections.push(...conns)
    return
  }

  updateConnections(
    connections,
    connectionsCount,
    utcTo,
    durationSnapshot,
    cutoffSeconds
  )
  updateDHT({ dht, connections, utcFrom, utcTo, msgQueue, version })

  generateConnectionEvents({
    connections,
    msgQueue,
    utcNow,
    version,
    runtime,
    durationSnapshot,
  })

  const state = generateState(connections, utcNow, dht, durationSnapshot)
  const data = Buffer.concat([version, runtime, state]).toString('binary')
  msgQueue.push({ ts: utcTo, type: 'state', data })
}

function sendQueue(ws) {
  const utcNow = Date.now()
  const queue = []
  msgQueue.forEach((item, idx) => {
    queue.push(msgQueue.splice(idx, 1)[0])
  })

  queue
    .sort((a, b) => a.ts - b.ts)
    .forEach(item => {
      setTimeout(() => {
        ws.send(item.data)
      }, Math.max(0, item.ts - utcNow))
    })
}

function handleClientMessage(client, server, msg) {
  // check client signal
  if (msg) {
    const clientSignal = ClientSignal.deserializeBinary(msg)
    const signal = clientSignal.getSignal()
    if (signal === ClientSignal.Signal.SEND_DATA) {
      sendQueue(client)
    } else if (
      signal === ClientSignal.Signal.START_PUSH_EMITTER ||
      signal === ClientSignal.Signal.UNPAUSE_PUSH_EMITTER
    ) {
      // TODO: implement unpause/start diff of timer emitter
      setInterval(() => {
        sendQueue(client)
      }, 200)
    } else if (
      signal === ClientSignal.Signal.STOP_PUSH_EMITTER ||
      signal === ClientSignal.Signal.PAUSE_PUSH_EMITTER
    ) {
      // TODO: implement pause/stop of timer emitter
    } else if (signal === ClientSignal.Signal.CONFIG_EMITTER) {
      try {
        const content = JSON.parse(clientSignal.getContent())
        if (content.durationSnapshot) {
          clearInterval(server.generator)
          server.generator = setInterval(() => {
            generateMessages({
              connectionsCount: server.connectionsCount,
              duration: content.durationSnapshot,
            })
          }, content.durationSnapshot)
        }
      } catch (error) {
        // ..
      }
    }
  }
}

function start({
  connectionsCount = 0,
  duration = DEFAULT_SNAPSHOT_DURATION,
  peersCount,
  cutoffSeconds,
} = {}) {
  // generate states
  wss.connectionsCount = connectionsCount
  wss.generator = setInterval(() => {
    generateMessages({ connectionsCount, peersCount, duration, cutoffSeconds })
  }, duration)

  // handle messages
  wss.on('connection', ws => {
    // allow only 1 client connection, it's just a mock server
    wss.clients.forEach(client => {
      if (client !== ws) {
        console.error(
          'Closing previous connection! Only 1 allowed for mock server.'
        )
        client.close()
      }
    })
    // handle incoming messages
    ws.on('message', msg => {
      handleClientMessage(ws, wss, msg)
    })
  })

  server.on('upgrade', function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request)
    })
  })

  // listen for connections
  server.listen(8080, () => {
    console.log('Websocket server listening on ws://localhost:8080')
  })
}

module.exports = {
  start,
}
