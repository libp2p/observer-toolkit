import React, { useContext, useState } from 'react'
import T from 'prop-types'

import { parseBuffer, samples } from 'proto'
import { DataContext, SetterContext } from 'sdk'

import StyledButton from './StyledButton'

function getSampleData() {
  const b64string = samples[0].default
  const buf = Buffer.from(b64string, 'base64')
  const data = parseBuffer(buf)
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
