import {
  RenderAsString,
  RenderPeerId,
  RenderTime,
} from '../components/contentRenderers'

const knownEventContent = {
  default: {
    Renderer: RenderAsString,
  },
  // This is a non-exhaustive list of some event content types
  // common or distinct enough to be worth handling as special cases
  peerId: {
    label: 'Peer ID',
    Renderer: RenderPeerId,
  },
  openTime: {
    label: 'Time opened',
    Renderer: RenderTime,
  },
}

export default knownEventContent
