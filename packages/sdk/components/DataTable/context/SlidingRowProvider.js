import React, { createContext, useReducer } from 'react'
import T from 'prop-types'

const SlidingRowContext = createContext()
const SlidingRowSetterContext = createContext()

function updateSlidingRows(oldRowDefs, { action, rowDef }) {
  switch (action) {
    case 'append':
      return appendSlidingRow(rowDef, oldRowDefs)
    case 'clear':
      return []
  }
}

function appendSlidingRow(rowDef, oldRowDefs) {
  const alreadySlidingRowIndex = oldRowDefs.findIndex(
    ({ rowRef }) => rowRef === rowDef.rowRef
  )
  if (alreadySlidingRowIndex === -1) {
    return [...oldRowDefs, rowDef]
  }
  const newRowDefs = [...oldRowDefs]
  newRowDefs[alreadySlidingRowIndex] = rowDef
  return newRowDefs
}

function SlidingRowProvider({ children }) {
  const [slidingRows, dispatchSlidingRows] = useReducer(updateSlidingRows, [])

  return (
    <SlidingRowSetterContext.Provider value={dispatchSlidingRows}>
      <SlidingRowContext.Provider value={slidingRows}>
        {children}
      </SlidingRowContext.Provider>
    </SlidingRowSetterContext.Provider>
  )
}

SlidingRowProvider.propTypes = {
  children: T.node.isRequired,
}

export { SlidingRowProvider, SlidingRowSetterContext, SlidingRowContext }
