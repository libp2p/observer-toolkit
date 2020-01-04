import React, { useState } from 'react'
import T from 'prop-types'

import {
  DataProvider,
  RootNodeProvider,
  ThemeSetter,
} from '@libp2p-observer/sdk'

import { loadSample } from '../utils'

const mockData = loadSample()

function DataTestWrapper({ children }) {
  return (
    <ThemeSetter>
      <RootNodeProvider>
        <DataProvider initialData={mockData}>{children}</DataProvider>
      </RootNodeProvider>
    </ThemeSetter>
  )
}

DataTestWrapper.propTypes = {
  children: T.node.isRequired,
}

export default DataTestWrapper
