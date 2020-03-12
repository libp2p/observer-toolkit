'use strict'

const http = require('http')
const WebSocket = require('ws')
const {
  proto: { ClientSignal },
} = require('@libp2p-observer/proto')
const { random, decodeBinToNum } = require('./utils')
const {
  generateConnections,
  generateDHT,
  generateEvent,
  generateRuntime,
  generateState,
  generateVersion,
  updateConnections,
  updateDHT,
} = require('./generate')

const { roleList } = require('./enums/roleList')
const { transportList } = require('./enums/transportList')

const connections = []
const version = generateVersion()
const runtime = generateRuntime()
const server = http.createServer()
const wss = new WebSocket.Server({ noServer: true })
// let tmrMessages
// let tmrQueueProcess

const msgQueue = []

function generateMessages({ connectionsCount, peersCount }) {
  const utcNow = Date.now()
  const utcFrom = utcNow,
    utcTo = utcNow + 1000
  const dht = generateDHT({ peersCount })

  if (!connections.length) {
    connections.length = 0
    const conns = generateConnections(connectionsCount, utcFrom - 1000)
    updateConnections(conns, null, utcFrom)
    connections.push(...conns)
    return
  }

  updateConnections(connections, connectionsCount, utcTo)
  updateDHT(dht, connections, utcFrom, utcTo)

  // send event when connection is opening/closing
  connections
    .filter(cn => cn.getStatus() === 2 || cn.getStatus() === 3)
    .forEach(cn => {
      const now = utcFrom + Math.floor(random() * 800 + 100)
      const type = cn.getStatus() === 2 ? 'PeerConnecting' : 'PeerDisconnecting'
      const content = {
        peerId: cn.getPeerId(),
        transport: transportList.getItem(decodeBinToNum(cn.getTransportId())),
      }
      if (type === 'PeerDisconnecting') {
        const open = cn
          .getTimeline()
          .getOpenTs()
          .getSeconds()
        content.age = `${now - open}`
        content.openTime = `${open}`
      }
      if (type === 'PeerConnecting') {
        content.role = roleList.getItem(cn.getRole())
      }
      const event = generateEvent({ now, type, content })
      const data = Buffer.concat([version, runtime, event]).toString('binary')
      msgQueue.push({ ts: now, type: 'event', data })
    })

  const state = generateState(connections, utcTo, dht)
  const data = Buffer.concat([version, runtime, state]).toString('binary')
  msgQueue.push({ ts: utcTo, type: 'state', data })
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
      // TODO: implement unpause/start diff of timer emitter
      setInterval(() => {
        sendQueue(ws)
      }, 200)
    } else if (
      signal === ClientSignal.Signal.STOP_PUSH_EMITTER ||
      signal === ClientSignal.Signal.PAUSE_PUSH_EMITTER
    ) {
      // TODO: implement pause/stop of timer emitter
    }
  }
}

function start({ connectionsCount = 0, peersCount }) {
  // generate states
  setInterval(() => {
    generateMessages({ connectionsCount, peersCount })
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
