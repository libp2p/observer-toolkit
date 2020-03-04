import {
  RenderAsString,
  RenderPeerId,
  RenderTime,
} from '../components/contentRenderers'

const knownEventContent = {
  default: RenderAsString,
  // This is a non-exhaustive list of some event content types
  // common or distinct enough to be worth handling as special cases
  peerId: RenderPeerId,
  openTime: RenderTime,
}

export default knownEventContent
