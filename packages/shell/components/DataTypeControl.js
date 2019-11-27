import React, { useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon } from '@libp2p-observer/sdk'

const Container = styled.div`
  background: ${({ theme }) => theme.color('contrast', 2)};
  border-radius: ${({ theme }) => theme.spacing()};
  color: ${({ theme }) => theme.color('text', 2)};
  text-align: left;
  :hover {
    background: ${({ theme }) => theme.color('background')};
    color: ${({ theme }) => theme.color('highlight', 1)};
  }
`

const IconButton = styled.button`
  background: ${({ theme }) => theme.color('background')};
  padding: ${({ theme }) => theme.spacing(0.5)};
  margin: ${({ theme }) => theme.spacing(-0.5)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.color('highlight')};
  border-radius: 50%;
  border: none;
  cursor: pointer;
`

function DataTypeControl({ metadata }) {
  const [isHighlighted, setHighlighted] = useState(false)

  if (!metadata) return ''

  const { type, name } = metadata

  const iconType = isHighlighted ? 'sort' : type

  // TODO: When implementing live ws mode:
  //  - Make icon pulse gently while live
  //  - Show "pause" icon when paused
  return (
    <Container
      onMouseEnter={() => setHighlighted(true)}
      onMouseLeave={() => setHighlighted(false)}
    >
      <IconButton>
        <Icon type={iconType} />
      </IconButton>
      {isHighlighted ? 'Change data source' : name}
    </Container>
  )
}

DataTypeControl.propTypes = {
  type: T.string.isRequired,
}

export default DataTypeControl
