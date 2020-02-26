'use strict'

const http = require('http')
const WebSocket = require('ws')
const {
  proto: { ClientSignal },
} = require('@libp2p-observer/proto')
const { random } = require('./utils')
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

const connections = []
const dht = generateDHT()
const version = generateVersion()
const runtime = generateRuntime()
const server = http.createServer()
const wss = new WebSocket.Server({ noServer: true })
// let tmrMessages
// let tmrQueueProcess

const msgQueue = []

function generateMessages({ connectionsCount }) {
  const utcNow = Date.now()

  updateConnections(connections, connectionsCount, utcNow)

  // send event when connection is opening/closing
  connections
    .filter(cn => cn.getStatus() === 2 || cn.getStatus() === 3)
    .forEach(cn => {
      const now = utcNow + Math.floor(random() * 800 + 100)
      const type = cn.getStatus() === 2 ? 'opening' : 'closing'
      const content = { peerId: cn.getPeerId() }
      const event = generateEvent({ now, type, content })
      msgQueue.push({ ts: now, type: 'event', data: event })
    })

  updateDHT(dht)

  const state = generateState(connections, utcNow, dht)
  msgQueue.push({ ts: utcNow, type: 'state', data: state })
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
      const buf =
        item.type === 'state'
          ? Buffer.concat([version, runtime, item.data]).toString('binary')
          : Buffer.concat([version, item.data]).toString('binary')
      ws.send(buf)
    })
}

function handleClientMessage(ws, msg) {
  // check client signal
  if (msg) {
    const clientSignal = ClientSignal.deserializeBinary(msg)
    const signal = clientSignal.getSignal()
    if (signal === ClientSignal.Signal.SEND_DATA) {
      sendQueue(ws) // sendState()
    } else if (
      signal === ClientSignal.Signal.START_PUSH_EMITTER ||
      signal === ClientSignal.Signal.UNPAUSE_PUSH_EMITTER
    ) {
      // tmrQueueProcess =
      setInterval(() => {
        sendQueue(ws)
      }, 200)
    } else if (
      signal === ClientSignal.Signal.STOP_PUSH_EMITTER ||
      signal === ClientSignal.Signal.PAUSE_PUSH_EMITTER
    ) {
      // if (tmrEmitter) {
      //     clearInterval(tmrEmitter)
      // }
    }
  }
}

function start({ connectionsCount = 0 }) {
  // initial connections if none exist
  if (!connectionsCount) {
    connections.length = 0
    connections.push(generateConnections(connectionsCount, Date.now()))
  }

  // generate states
  //tmrMessages =
  setInterval(() => {
    generateMessages({ connectionsCount })
  }, 1000)

  // handle messages
  wss.on('connection', ws => {
    ws.on('message', msg => {
      handleClientMessage(ws, msg)
    })
    sendQueue(ws)
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

  //   function sendEvent({ now = Date.now(), type = '', content = {} } = {}) {
  //     // send event
  //     const event = generateEvent({ now, type, content })
  //     const data = Buffer.concat([version, event]).toString('binary')
  //     ws.send(data)
  //   }

  //   function sendState() {
  //     // send states
  //     const _utcFrom = utcTo - 1000
  //     const _utcTo = Date.now()
  //     const states = generateStates(
  //       connections,
  //       connectionsCount,
  //       utcFrom,
  //       utcTo,
  //       dht
  //     )
  //     // state
  //     const data = states.length
  //       ? Buffer.concat([version, runtime, ...states]).toString('binary')
  //       : ''
  //     if (data) {
  //       utcFrom = _utcFrom
  //       utcTo = _utcTo
  //     }
  //     setTimeout(() => {
  //       ws.send(data)
  //     }, 100)
  //   }

  //   // ready signal handler
  //   ws.on('message', msg => {
  //     // check client signal
  //     if (msg) {
  //       const clientSignal = ClientSignal.deserializeBinary(msg)
  //       const signal = clientSignal.getSignal()
  //       if (signal === ClientSignal.Signal.SEND_DATA) {
  //         sendState()
  //       } else if (
  //         signal === ClientSignal.Signal.START_PUSH_EMITTER ||
  //         signal === ClientSignal.Signal.UNPAUSE_PUSH_EMITTER
  //       ) {
  //         tmrEmitter = setInterval(function() {
  //           sendState()
  //         }, 1000)
  //       } else if (
  //         signal === ClientSignal.Signal.STOP_PUSH_EMITTER ||
  //         signal === ClientSignal.Signal.PAUSE_PUSH_EMITTER
  //       ) {
  //         if (tmrEmitter) {
  //           clearInterval(tmrEmitter)
  //         }
  //       }
  //     }
  //   })
  // //   // on connection, send initial packet
  // //   const states = generateStates(
  // //     connections,
  // //     connectionsCount,
  // //     utcFrom,
  // //     utcTo,
  // //     dht
  // //   )
  //   ws.send(Buffer.concat([version, runtime, ...states]).toString('binary'))
}

module.exports = {
  start,
}
