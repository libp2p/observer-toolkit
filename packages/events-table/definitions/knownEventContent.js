import {
  RenderAsString,
  RenderJsonString,
  RenderPeerId,
  RenderTime,
} from '../components/contentRenderers'

const knownEventContent = {
  default: {
    Renderer: RenderAsString,
  },
  // This is a non-exhaustive list of some event content types
  // common or distinct enough to be worth handling as special cases
  json: {
    label: 'JSON',
    Renderer: RenderJsonString,
  },
  peerId: {
    label: 'Peer ID',
    Renderer: RenderPeerId,
  },
  openTime: {
    label: 'Opened',
    Renderer: RenderTime,
  },
}

export default knownEventContent
