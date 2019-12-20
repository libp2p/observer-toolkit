import React, { createContext } from 'react'
import T from 'prop-types'

const MetadataContext = createContext()

function MetadataProvider({ metadata, children }) {
  return (
    <MetadataContext.Provider value={metadata}>
      {children}
    </MetadataContext.Provider>
  )
}

MetadataProvider.propTypes = {
  metadata: T.object,
  children: T.node,
}

export { MetadataContext, MetadataProvider }
