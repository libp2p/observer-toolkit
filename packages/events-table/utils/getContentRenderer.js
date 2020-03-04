import knownEventContent from '../definitions/knownEventContent'

function getContentRenderer(contentKey) {
  const Renderer = knownEventContent[contentKey] || knownEventContent.default
  return Renderer
}

export default getContentRenderer
