import knownEventContent from '../definitions/knownEventContent'
import { RenderAsString } from '../components/contentRenderers'

function getEventContent(contentKey) {
  const { label = contentKey, Renderer = RenderAsString } =
    knownEventContent[contentKey] || knownEventContent.default

  return {
    label,
    Renderer,
  }
}

export default getEventContent
