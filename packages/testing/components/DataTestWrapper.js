import React from 'react'
import T from 'prop-types'

import {
  DataProvider,
  FilterProvider,
  RootNodeProvider,
  ThemeSetter,
} from '@libp2p-observer/sdk'

import { loadSample } from '../utils'

const mockData = loadSample()

function DataTestWrapper({ children }) {
  return (
    <ThemeSetter>
      <RootNodeProvider>
        <FilterProvider>
          <DataProvider initialData={mockData}>{children}</DataProvider>
        </FilterProvider>
      </RootNodeProvider>
    </ThemeSetter>
  )
}

DataTestWrapper.propTypes = {
  children: T.node.isRequired,
}

export default DataTestWrapper
