import React, { useMemo, useContext } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { withResizeDetector } from 'react-resize-detector'

import { DataContext } from '@libp2p-observer/sdk'

import { stackData, fitDataToPaths } from './utils'
import TimelinePaths from './TimelinePaths'
import TimeSlider from './TimeSlider'

const HEIGHT_DEFAULT = 128

const Container = styled.div`
  background: ${({ theme }) => theme.color('dark', 'mid')};
  position: relative;
  padding: ${({ theme }) => theme.spacing()} 0;
  color: ${({ theme }) => theme.color('light', 'light')};
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
  color: ${({ theme }) => theme.color('light', 'light')};
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

// TODO: make width responsive, filling space
function Timeline({ width = 700, height = HEIGHT_DEFAULT }) {
  const dataset = useContext(DataContext)

  const svgHeight = Math.min(height / 2 - 16, HEIGHT_DEFAULT)

  const {
    stackedDataIn,
    stackedDataOut,
    xScale,
    yScaleIn,
    yScaleOut,
  } = useMemo(() => stackData(dataset), [dataset])

  const fitDataArgs = [
    width,
    svgHeight,
    stackedDataIn,
    stackedDataOut,
    xScale,
    yScaleIn,
    yScaleOut,
  ]
  const { dataInPathDefs, dataOutPathDefs } = useMemo(
    () => fitDataToPaths(fitDataArgs),
    [fitDataArgs]
  )

  if (!dataset || !dataset.length)
    return (
      <Container
        style={{
          height: '96px',
        }}
      >
        <p
          style={{
            // TODO: improve this
            color: 'white',
            textAlign: 'center',
          }}
        >
          <b>No data selected.</b> Use the tabs at the top of the page to load
          some data.
        </p>
      </Container>
    )

  return (
    <Container>
      <PathsContainer>
        <DataInLabel>Data in</DataInLabel>
        <TimelinePaths
          pathDefs={dataInPathDefs}
          svgHeight={svgHeight}
          colorKey="primary"
          style={{ marginTop: '8px' }}
        />
      </PathsContainer>
      <PathsContainer>
        <DataOutLabel>Data out</DataOutLabel>
        <TimelinePaths
          pathDefs={dataOutPathDefs}
          svgHeight={svgHeight}
          colorKey="secondary"
        />
      </PathsContainer>
      <TimeSlider width={width} />
    </Container>
  )
}

Timeline.propTypes = {
  width: T.number,
  height: T.number,
}

export default withResizeDetector(Timeline)