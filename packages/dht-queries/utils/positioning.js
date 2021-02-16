function _getScrollY() {
  return window.scrollY || document.body.scrollTop || 0
}

function _getScrollX() {
  return window.scrollX || document.body.scrollLeft || 0
}

function getAbsolutePosition(elem) {
  const rect = elem.getBoundingClientRect()
  return {
    x: rect.left + _getScrollX(),
    y: rect.top + _getScrollY(),
  }
}

function diffAbsolutePositions(posA, posB) {
  return {
    x: posA.x - posB.x,
    y: posA.y - posB.y,
  }
}

function getTranslateString(diffPos) {
  const translateX = `${diffPos.x}px`
  const translateY = `${diffPos.y}px`
  return `translate(${translateX}, ${translateY})`
}

export { getAbsolutePosition, diffAbsolutePositions, getTranslateString }
