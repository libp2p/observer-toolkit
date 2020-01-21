import { buildQueries, queryHelpers } from '@testing-library/react'

const queryAllByAriaLabel = (container, textMatch, { includeSelf } = {}) => {
  const matches = queryHelpers.queryAllByAttribute(
    'aria-label',
    container,
    textMatch
  )

  if (includeSelf) {
    const ariaLabel = container.getAttribute('data-highlighted')
    if (
      ariaLabel === textMatch ||
      (textMatch instanceof RegExp && ariaLabel.match(textMatch)) ||
      (typeof textMatch === 'function' && textMatch(ariaLabel))
    )
      return [container, ...matches]
  }

  return matches
}

const getMultipleError = element => {
  throw new Error('Multiple aria-label matches found')
}
const getMissingError = element => {
  throw new Error('No aria-label match found')
}

const [
  queryByAriaLabel,
  getAllByAriaLabel,
  getByAriaLabel,
  findAllByAriaLabel,
  findByAriaLabel,
] = buildQueries(queryAllByAriaLabel, getMultipleError, getMissingError)

export {
  queryByAriaLabel,
  queryAllByAriaLabel,
  getByAriaLabel,
  getAllByAriaLabel,
  findAllByAriaLabel,
  findByAriaLabel,
}
