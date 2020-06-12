import React, { useEffect, useState } from 'react'
import T from 'prop-types'

import { DataProvider } from '@libp2p/observer-sdk'

import ThemeWrapper from './ThemeWrapper'
import fetchSample from '../loaders/fetchSample'

function DataDemoWrapper({ children, sampleIndex, sample, deserialize }) {
  const [mock, setMock] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load data asynchronously using browser fetch
  useEffect(() => {
    if (isLoading || !!mock) return
    setIsLoading(true)

    const applyMock = async () => {
      const mock = await fetchSample(sampleIndex, sample, deserialize)

      setMock(mock)
      setIsLoading(false)
    }
    applyMock()
  }, [isLoading, mock, setMock, setIsLoading, sampleIndex, sample, deserialize])

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
  sampleIndex: T.number,
  sample: T.object,
  deserialize: T.func,
}

export default DataDemoWrapper
