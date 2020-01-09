import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon } from '@libp2p-observer/sdk'

const Container = styled.div`
  display: flex;
  background: ${({ theme }) => theme.color('contrast', 1)};
  cursor: pointer;
  ${({ theme }) => theme.text('label', 'small')}
`

const IconButton = styled.button`
  background: ${({ theme }) => theme.color('background')};
  margin: ${({ theme }) => theme.spacing([0, 1, 0, 0.5])};
  color: ${({ theme }) => theme.color('highlight')};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  position: relative;
  padding: ${({ theme }) => theme.spacing(0.5)};
  z-index: 2;
`

const ButtonText = styled.span`
  flex-grow: 1;
  background: ${({ theme }) => theme.color('contrast', 2)};
  border-radius: ${({ theme }) => theme.spacing()};
  color: ${({ theme }) => theme.color('text', 3)};
  padding: ${({ theme }) => theme.spacing([0.5, 1, 0.5, 2.5])};
  margin: ${({ theme }) => theme.spacing([0.5, 0, 0.5, -2.5])};
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ theme, isHighlighted }) =>
    isHighlighted &&
    `
    background: ${theme.color('background')};
    color: ${theme.color('highlight', 1)};
  `}
`

function DataTypeControl({ metadata, openDataTray }) {
  const [isHighlighted, setHighlighted] = useState(false)

  if (!metadata) return ''

  const { type, name } = metadata

  const iconNames = {
    sample: 'cloud',
    upload: 'doc',
  }
  if (!iconNames[type]) {
    throw new Error(
      `Unknown type "${type}", expected one of "${Object.keys(iconNames).join(
        '", "'
      )}"`
    )
  }

  const iconType = isHighlighted ? 'back' : iconNames[type]

  // TODO: When implementing live ws mode:
  //  - Make icon pulse gently while live
  //  - Show "pause" icon when paused
  return (
    <Container
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
      data-highlighted={isHighlighted}
      onClick={openDataTray}
    >
      <IconButton isHighlighted={isHighlighted}>
        <Icon type={iconType} />
      </IconButton>
      <ButtonText isHighlighted={isHighlighted}>
        {isHighlighted ? 'Change data source' : name}
      </ButtonText>
    </Container>
  )
}

DataTypeControl.propTypes = {
  metadata: T.object,
  openDataTray: T.func.isRequired,
}

export default DataTypeControl
