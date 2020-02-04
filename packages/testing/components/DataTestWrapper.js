import React from 'react'
import T from 'prop-types'

import { DataProvider } from '@libp2p-observer/sdk'

import ThemeWrapper from './ThemeWrapper'
import loadSample from '../loaders/loadSample'

// Load data synchronously using Node FS so tests don't need to re-render
const mockData = loadSample()

function DataTestWrapper({ providers = {}, children }) {
  const _DataProvider = providers.DataProvider || DataProvider
  return (
    <ThemeWrapper contexts={providers}>
      <_DataProvider initialData={mockData}>{children}</_DataProvider>
    </ThemeWrapper>
  )
}

DataTestWrapper.propTypes = {
  providers: T.object,
  children: T.node.isRequired,
}

export default DataTestWrapper
