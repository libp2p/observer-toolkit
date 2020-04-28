import { useContext } from 'react'
import { proto, fnv1a } from '@libp2p-observer/proto'

import {
  DataContext,
  EventsContext,
  RuntimeContext,
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

function getPacket(message, type) {
  const dataPacket = new proto.ProtocolDataPacket()

  dataPacket.setVersion(new proto.Version(version))

  if (type === 'runtime') {
    dataPacket.setRuntime(message)
  } else if (type === 'event') {
    dataPacket.setEvent(message)
  } else if (type === 'state') {
    dataPacket.setState(message)
  } else {
    throw new Error(`Unrecognised packet type "${type}"`)
  }

  return dataPacket
}

function getVersionBinary() {
  const versionBuf = Buffer.alloc(4)

  // TODO: get versions from central source
  versionBuf.writeUInt32LE(1, 0)
  return versionBuf
}

function useFileBlob() {
  const states = useContext(DataContext)
  const events = useContext(EventsContext)
  const runtime = useContext(RuntimeContext)

  const statePackets = states.map(state => getPacket(state, 'state'))
  const eventPackets = events.map(event => getPacket(event, 'event'))
  const runtimePacket = getPacket(runtime, 'runtime')

  const blob = new Blob([
    ...getVersionBinary(),
    ...statePackets.map(getBinary),
    ...eventPackets.map(getBinary),
    getBinary(runtimePacket),
  ])

  return blob
}

export default useFileBlob
