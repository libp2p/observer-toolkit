import { useContext } from 'react'
import { proto, fnv1a } from '@nearform/observer-proto'

import {
  DataContext,
  EventsContext,
  RuntimeContext,
  ConfigContext,
} from '../components/context'

const version = 1

function getBinary(message) {
  const { buffer, byteLength } = message.serializeBinary()

  const contentBuffer = Buffer.from(buffer)
  const checksum = fnv1a(contentBuffer)

  const metaBuffer = Buffer.alloc(8)
  metaBuffer.writeUIntLE(checksum, 0, 4)
  metaBuffer.writeUIntLE(byteLength, 4, 4)

  return Buffer.concat([metaBuffer, contentBuffer])
}

function getServerMessage(message, type) {
  const serverMessage = new proto.ServerMessage()

  serverMessage.setVersion(new proto.Version(version))

  if (type === 'runtime') {
    serverMessage.setRuntime(message)
  } else if (type === 'event') {
    serverMessage.setEvent(message)
  } else if (type === 'state') {
    serverMessage.setState(message)
  } else if (type === 'response') {
    serverMessage.setResponse(message)
  } else {
    throw new Error(`Unrecognised ServerMessage payload type "${type}"`)
  }

  return serverMessage
}

function getVersionBinary() {
  const versionBuf = Buffer.alloc(4)

  // TODO: get versions from central source
  versionBuf.writeUInt32LE(1, 0)
  return versionBuf
}

function getConfigResponse(config) {
  const response = new proto.CommandResponse()
  response.setResult(proto.CommandResponse.Result.OK)
  response.setEffectiveConfig(config)
  response.setId(0) // Only one response in static file
  return response
}

function useFileBlob() {
  const states = useContext(DataContext)
  const events = useContext(EventsContext)
  const runtime = useContext(RuntimeContext)
  const config = useContext(ConfigContext)
  const configResponse = getConfigResponse(config)

  const statePackets = states.map(state => getServerMessage(state, 'state'))
  const eventPackets = events.map(event => getServerMessage(event, 'event'))
  const runtimePacket = getServerMessage(runtime, 'runtime')
  const configPacket = getServerMessage(configResponse, 'response')

  const blob = new Blob([
    ...getVersionBinary(),
    getBinary(runtimePacket),
    getBinary(configPacket),
    ...statePackets.map(getBinary),
    ...eventPackets.map(getBinary),
  ])

  return blob
}

export default useFileBlob
