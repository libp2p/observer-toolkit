import React, { useEffect, useState } from 'react'
import T from 'prop-types'

import { DataProvider } from '@nearform/observer-sdk'

import ThemeWrapper from './ThemeWrapper'
import fetchSample from '../loaders/fetchSample'

function DataDemoWrapper({ children }) {
  const [mock, setMock] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load data asynchronously using browser fetch
  useEffect(() => {
    if (isLoading || !!mock) return
    setIsLoading(true)

    const applyMock = async () => {
      const mock = await fetchSample()

      setMock(mock)
      setIsLoading(false)
    }
    applyMock()
  }, [isLoading, mock, setMock, setIsLoading])

  return !mock ? (
    'Preparing sample data...'
  ) : (
    <ThemeWrapper>
      <DataProvider initialSource={mock.source} initialData={mock.data}>
        {children}
      </DataProvider>
    </ThemeWrapper>
  )
}

DataDemoWrapper.propTypes = {
  children: T.node.isRequired,
}

export default DataDemoWrapper
