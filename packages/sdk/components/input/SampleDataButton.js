import React, { useContext, useState } from 'react'
import T from 'prop-types'

import { parseImport } from '@libp2p-observer/data'
import { DataContext, SetterContext } from '@libp2p-observer/sdk'
import samples from '@libp2p-observer/samples'

import StyledButton from './StyledButton'

function getSampleData() {
  const data = parseImport(samples[0])
  data.isSample = true
  return data
}

function SampleDataButton({ title }) {
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchDataset } = useContext(SetterContext)
  const dataset = useContext(DataContext)

  const applySampleData = () => {
    if (dataset.isSample) {
      dispatchDataset({
        action: 'remove',
      })
      return
    }

    // Apply data on tick after setting loading state so indicator can show
    setIsLoading(true)
    setTimeout(() => {
      dispatchDataset({
        action: 'replace',
        data: getSampleData(),
      })
      setIsLoading(false)
    }, 50)
  }

  const buttonText =
    (isLoading && 'Loading...') ||
    (dataset.isSample && 'Remove sample') ||
    title

  return (
    <StyledButton
      onClick={applySampleData}
      isActive={isLoading || dataset.isSample}
    >
      {buttonText}
    </StyledButton>
  )
}

SampleDataButton.propTypes = {
  title: T.string.isRequired,
}

export default SampleDataButton
