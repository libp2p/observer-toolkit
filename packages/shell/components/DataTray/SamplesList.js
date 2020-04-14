import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import samples from '@libp2p-observer/samples'
import { applySampleData, SetterContext } from '@libp2p-observer/sdk'

const SamplesTray = styled.div`
  position: absolute;
  top: 100%;
  background: ${({ theme }) => theme.color('contrast', 2)};
  margin: 0;
  padding: ${({ theme }) => theme.spacing([0, 2])};
  border-width: ${({ theme }) => theme.spacing(0.5)};
  border-style: solid;
  border-color: ${({ theme }) => theme.color('contrast', 1)};
  border-top-width: 0;
  left: ${({ theme }) => theme.spacing(-2.5)};
  right: ${({ theme }) => theme.spacing(-2.5)};
  border-radius: ${({ theme }) => theme.spacing([0, 0, 2, 2])};
  max-width: 540px;
`

const SampleItem = styled.button`
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing([0.5, 0.5, 0.5, 1])};
  background: ${({ theme }) => theme.color('contrast', 0)};
  ${({ theme }) => theme.text('label', 'medium')}
  color: ${({ theme }) => theme.color('text', 3, 0.7)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.spacing([1, 0])};
  &:active, :focus, :hover {
    background: ${({ theme }) => theme.color('contrast', 0, 0.7)};
  }
`

const SampleImg = styled.img`
  flex-shrink: 1;
  max-width: 75%;
  display: block;
`

function SamplesList({ onLoad }) {
  const [isLoading, setIsLoading] = useState('')
  const { removeData, updateData, updateSource } = useContext(SetterContext)

  function handleClick(samplePath) {
    const handleUploadStart = name => {
      removeData()
      updateSource({ type: 'sample', name })
      setIsLoading(samplePath)
    }
    applySampleData(
      samplePath,
      handleUploadStart,
      handleUploadFinished,
      handleUploadChunk
    )
  }

  function handleUploadFinished() {
    if (isLoading) setIsLoading(false)
    if (onLoad) onLoad()
  }

  function handleUploadChunk(data) {
    updateData(data)
  }

  return (
    <>
      <div>Choose a sample:</div>
      <SamplesTray>
        {samples.map(({ name, img, file }) => {
          const text = (isLoading === file && 'Loading...') || name

          return (
            <SampleItem key={name} onClick={() => handleClick(file)}>
              {text}
              <SampleImg src={img} />
            </SampleItem>
          )
        })}
      </SamplesTray>
    </>
  )
}

SamplesList.propTypes = {
  onLoad: T.func,
}

export default SamplesList
