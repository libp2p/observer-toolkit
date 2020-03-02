'use strict'

const http = require('http')
const WebSocket = require('ws')
const {
  proto: { ClientSignal },
} = require('@libp2p-observer/proto')
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
const dht = generateDHT()
const version = generateVersion()
const runtime = generateRuntime()
const server = http.createServer()
const wss = new WebSocket.Server({ noServer: true })
// let tmrMessages
// let tmrQueueProcess

let active = true

const msgQueue = []

function generateMessages({ connectionsCount }) {
  const utcNow = Date.now()

  if (!connections.length) {
    connections.length = 0
    const conns = generateConnections(connectionsCount, utcNow - 1000)
    updateConnections(conns, null, utcNow)
    connections.push(...conns)
  } else {
    updateConnections(connections, connectionsCount, utcNow)
  }
  generateConnectionEvents({
    connections,
    msgQueue,
    utcNow,
    version,
    runtime,
  })

  updateDHT(dht, connections, utcNow, utcNow + 1000)

  const state = generateState(connections, utcNow, dht)
  const data = Buffer.concat([version, runtime, state]).toString('binary')
  msgQueue.push({ ts: utcNow + 1000, type: 'state', data })
}

function sendQueue(ws) {
  const utcNow = Date.now()
  const queue = []
  msgQueue.forEach((item, idx) => {
    if (item.ts <= utcNow) {
      queue.push(msgQueue.splice(idx, 1)[0])
    }
  })
  queue
    .sort((a, b) => a.ts - b.ts)
    .forEach(item => {
      ws.send(item.data)
    })
}

let sendQueueInterval

function handleClientMessage(ws, msg) {
  // check client signal
  if (msg) {
    const clientSignal = ClientSignal.deserializeBinary(msg)
    const signal = clientSignal.getSignal()
    if (signal === ClientSignal.Signal.SEND_DATA) {
      sendQueue(ws)
    } else if (
      signal === ClientSignal.Signal.START_PUSH_EMITTER ||
      signal === ClientSignal.Signal.UNPAUSE_PUSH_EMITTER
    ) {
      active = true
      // TODO: implement unpause/start diff of timer emitter
      sendQueueInterval = setInterval(() => {
        if (active) sendQueue(ws)
      }, 200)
    } else if (
      signal === ClientSignal.Signal.STOP_PUSH_EMITTER ||
      signal === ClientSignal.Signal.PAUSE_PUSH_EMITTER
    ) {
      active = false
      clearInterval(sendQueueInterval)
      // TODO: implement pause/stop of timer emitter
    }
  }
}

function start({ connectionsCount = 0 }) {
  // generate states
  setInterval(() => {
    if (active) generateMessages({ connectionsCount })
  }, 1000)

  // handle messages
  wss.on('connection', ws => {
    ws.on('message', msg => {
      handleClientMessage(ws, msg)
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
