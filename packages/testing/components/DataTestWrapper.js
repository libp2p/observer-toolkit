import React from 'react'
import T from 'prop-types'

import { DataProvider } from '@libp2p-observer/sdk'

import DataOuterWrapper from './DataOuterWrapper'
import loadSample from '../loaders/loadSample'

// Load data synchronously using Node FS so tests don't need to re-render
const mockData = loadSample()

function DataTestWrapper({ children }) {
  return (
    <DataOuterWrapper>
      <DataProvider initialData={mockData}>{children}</DataProvider>
    </DataOuterWrapper>
  )
}

DataTestWrapper.propTypes = {
  children: T.node.isRequired,
}

export default DataTestWrapper
