import { buildQueries, queryHelpers } from '@testing-library/react'

// We only care if the attr is truthy
const textMatch = attrValue => !!attrValue

const queryAllByHighlighted = container =>
  queryHelpers.queryAllByAttribute('data-highlighted', container, textMatch)

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
