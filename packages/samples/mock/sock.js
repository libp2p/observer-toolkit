'use strict'

const http = require('http')
const WebSocket = require('ws')
const {
  proto: { ClientSignal },
} = require('@nearform/observer-proto')
const { DEFAULT_SNAPSHOT_DURATION } = require('./utils')
const {
  generateConnections,
  generateConnectionEvents,
  // generateEventsFlood,
  generateDHT,
  generateRuntime,
  generateState,
  generateVersion,
  updateConnections,
  updateDHT,
} = require('./generate')
const { createRuntime } = require('./messages/runtime')

const connections = []
const version = generateVersion()
const server = http.createServer()
const wss = new WebSocket.Server({ noServer: true })

const msgQueue = []

let runtime
let dht
let sendInterval
let generateInterval

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

  if (runtime) {
    durationSnapshot = runtime.getSendStateIntervalMs()
    cutoffSeconds = runtime.getRetentionPeriodMs() / 1000
  } else {
    runtime = createRuntime({
      stateIntervalDuration: durationSnapshot,
      cutoffSeconds,
    })
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

  const statePacket = generateState(connections, utcNow, dht, durationSnapshot)
  const data = Buffer.concat([version, statePacket]).toString('binary')
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
    } else if (signal === ClientSignal.Signal.UNPAUSE_PUSH_EMITTER) {
      clearInterval(sendInterval)
      sendInterval = setInterval(() => {
        sendQueue(client)
      }, 200)
    } else if (signal === ClientSignal.Signal.PAUSE_PUSH_EMITTER) {
      clearInterval(sendInterval)
    } else if (signal === ClientSignal.Signal.CONFIG_EMITTER) {
      try {
        const content = JSON.parse(clientSignal.getContent())
        let hasChanged = false
        const newDurationSnapshot =
          Number(content.durationSnapshot) ||
          Number(content.sendStateIntervalMs)

        if (newDurationSnapshot) {
          clearInterval(server.generator)
          server.generator = setInterval(() => {
            generateMessages({
              connectionsCount: server.connectionsCount,
              duration: newDurationSnapshot,
            })
          }, newDurationSnapshot)
          hasChanged = true
          runtime.setSendStateIntervalMs(newDurationSnapshot)
        }
        if (content.retentionPeriodMs) {
          hasChanged = true
          runtime.setRetentionPeriodMs(Number(content.retentionPeriodMs))
        }
        if (hasChanged) sendRuntime()
      } catch (error) {
        // log the failed signal and continue serving data
        console.warn('Error processing configuration signal', signal)
        console.error(error)
      }
    }
  }
}

function sendRuntime() {
  const runtimePacket = generateRuntime({}, runtime)
  const data = Buffer.concat([version, runtimePacket]).toString('binary')
  msgQueue.push({ ts: Date.now(), type: 'runtime', data })
}

function start({
  connectionsCount = 0,
  duration = DEFAULT_SNAPSHOT_DURATION,
  peersCount,
  cutoffSeconds,
} = {}) {
  // generate states
  wss.connectionsCount = connectionsCount

  clearInterval(generateInterval)
  clearInterval(sendInterval)
  generateInterval = setInterval(() => {
    generateMessages({ connectionsCount, peersCount, duration, cutoffSeconds })
  }, duration)
  wss.generator = generateInterval

  // handle messages
  wss.on('connection', ws => {
    // allow only 1 client connection, it's just a mock server
    wss.clients.forEach(client => {
      if (client === ws) {
        clearInterval(sendInterval)
        sendInterval = setInterval(() => {
          sendQueue(client)
        }, 200)
      } else {
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

    sendRuntime()
  })

  server.on('upgrade', function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request)
    })
  })

  // listen for connections
  server.listen(8080, err => {
    if (err) {
      console.error(err)
    } else {
      console.log('Websocket server listening on ws://localhost:8080')
    }
  })
}

module.exports = {
  start,
}
