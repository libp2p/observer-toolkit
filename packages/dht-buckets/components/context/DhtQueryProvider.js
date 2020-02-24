import React, { createContext } from 'react'
import T from 'prop-types'

import useDhtQueries from '../../hooks/useDhtQueries'

const DhtQueryContext = createContext()

function DhtQueryProvider({ children }) {
  const queriesByPeerId = useDhtQueries()
  return (
    <DhtQueryContext.Provider value={queriesByPeerId}>
      {children}
    </DhtQueryContext.Provider>
  )
}

DhtQueryProvider.propTypes = {
  children: T.node,
}

export { DhtQueryContext, DhtQueryProvider }
