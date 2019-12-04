import React, { useContext, useState } from 'react'
import T from 'prop-types'

import { applySampleData } from '../../utils'
import { DataContext, SetterContext } from '@libp2p-observer/sdk'

import StyledButton from './StyledButton'

function SampleDataButton({ title, samplePath }) {
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchDataset } = useContext(SetterContext)
  const dataset = useContext(DataContext)

  function handleButtonPress() {
    if (dataset.isSample) {
      dispatchDataset({
        action: 'remove',
      })
      return
    }

    applySampleData(samplePath, handleUploadStart, handleDataLoaded)
  }

  function handleUploadStart() {
    setIsLoading(true)
  }

  function handleDataLoaded(data) {
    data.isSample = true

    dispatchDataset({
      action: 'replace',
      data,
    })
    setIsLoading(false)
  }

  const buttonText =
    (isLoading && 'Loading...') ||
    (dataset.isSample && 'Remove sample') ||
    title

  return (
    <StyledButton
      onClick={handleButtonPress}
      isActive={isLoading || dataset.isSample}
    >
      {buttonText}
    </StyledButton>
  )
}

SampleDataButton.propTypes = {
  title: T.string.isRequired,
  samplePath: T.string.isRequired,
}

export default SampleDataButton
