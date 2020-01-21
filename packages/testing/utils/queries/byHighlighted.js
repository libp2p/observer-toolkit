import { buildQueries, queryHelpers } from '@testing-library/react'

// We only care if the attr is truthy
const truthyMatch = attrValue =>
  attrValue !== 'false' && attrValue !== '0' && !!attrValue
const falsyMatch = attrValue =>
  attrValue === 'false' || attrValue === '0' || !attrValue

const queryAllByHighlighted = (
  container,
  truthy = true,
  { includeSelf } = {}
) => {
  const textMatch = truthy ? truthyMatch : falsyMatch
  const matches = queryHelpers.queryAllByAttribute(
    'data-highlighted',
    container,
    textMatch
  )

  if (includeSelf && textMatch(container.getAttribute('data-highlighted'))) {
    return [container, ...matches]
  }

  return matches
}

const getMultipleError = element => {
  throw new Error('Multiple highlighted elements found')
}
const getMissingError = element => {
  throw new Error('No highlighted element found')
}

const [
  queryByHighlighted,
  getAllByHighlighted,
  getByHighlighted,
  findAllByHighlighted,
  findByHighlighted,
] = buildQueries(queryAllByHighlighted, getMultipleError, getMissingError)

export {
  queryByHighlighted,
  queryAllByHighlighted,
  getByHighlighted,
  getAllByHighlighted,
  findAllByHighlighted,
  findByHighlighted,
}
