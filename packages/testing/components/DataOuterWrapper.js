import React from 'react'
import T from 'prop-types'

import {
  FilterProvider,
  RootNodeProvider,
  ThemeSetter,
} from '@libp2p-observer/sdk'

function DataOuterWrapper({ children }) {
  return (
    <ThemeSetter>
      <RootNodeProvider>
        <FilterProvider>{children}</FilterProvider>
      </RootNodeProvider>
    </ThemeSetter>
  )
}

DataOuterWrapper.propTypes = {
  children: T.node.isRequired,
}

export default DataOuterWrapper
