import React, { useEffect, useState } from 'react'
import T from 'prop-types'

import { DataProvider } from '@libp2p-observer/sdk'

import DataOuterWrapper from './DataOuterWrapper'
import fetchSample from '../loaders/fetchSample'

function DataDemoWrapper({ children }) {
  const [mockData, setMockData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load data asynchronously using browser fetch
  useEffect(() => {
    if (isLoading || !!mockData) return
    setIsLoading(true)

    const applyMockData = async () => {
      const mockData = await fetchSample()

      setMockData(mockData)
      setIsLoading(false)
    }
    applyMockData()
  }, [isLoading, mockData, setMockData, setIsLoading])

  return !mockData ? (
    'Preparing sample data...'
  ) : (
    <DataOuterWrapper>
      <DataProvider initialData={mockData}>{children}</DataProvider>
    </DataOuterWrapper>
  )
}

DataDemoWrapper.propTypes = {
  children: T.node.isRequired,
}

export default DataDemoWrapper
