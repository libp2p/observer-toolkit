import React, { useMemo, useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { DataContext } from '@libp2p-observer/sdk'
import { withResizeDetector } from 'react-resize-detector'

import TimelinePaths from './TimelinePaths'
import TimeSlider from './TimeSlider'

const Container = styled.div`
  background: ${({ theme }) => theme.color('contrast')};
  position: relative;
  padding: ${({ theme }) => theme.spacing()} 0;
  color: ${({ theme }) => theme.color('text', 2)};
  user-select: none;
`

const PathsContainer = styled.div`
  position: relative;
  user-select: none;
`

const Label = styled.div`
  position: absolute;
  text-transform: uppercase;
  font-family: plex-sans;
  font-weight: 500;
  font-size: 8pt;
  color: ${({ theme }) => theme.color('text', 2)};
  left: ${({ theme }) => theme.spacing()};
`

const DataInLabel = styled(Label)`
  top: 0;
  user-select: none;
`

const DataOutLabel = styled(Label)`
  bottom: 0;
  user-select: none;
`

function Timeline({ width }) {
  const dataset = useContext(DataContext)

  if (!dataset || !dataset.length) return ''

  return (
    <Container>
      <PathsContainer>
        <DataInLabel>Data in</DataInLabel>
        <TimelinePaths dataDirection="in" width={width} colorKey="primary" />
      </PathsContainer>
      <PathsContainer>
        <DataOutLabel>Data out</DataOutLabel>
        <TimelinePaths dataDirection="out" width={width} colorKey="secondary" />
      </PathsContainer>
      <TimeSlider width={width} />
    </Container>
  )
}

Timeline.propTypes = {
  width: T.number.isRequired, // Set by withResizeDetector
}

export default withResizeDetector(Timeline)
