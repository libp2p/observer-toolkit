import React, { useMemo, useContext, useRef } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import { withResizeDetector } from 'react-resize-detector'

import { DataContext, SetterContext } from '../DataProvider'
import { stackData, fitDataToPaths } from './utils'
import TimelinePaths from './TimelinePaths'

// TODO: make width responsive, filling space
function Timeline({ width = 700, height = 128 }) {
  const dataset = useContext(DataContext)
  const { setTimepoint } = useContext(SetterContext)
  const sliderRef = useRef(null)

  const svgHeight = height / 2 - 28

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

  const offset = 20

  const prerenderedSlider = useMemo(() => {
    const onChangeHandler = e => {
      const newTimeIndex = e.currentTarget.value
      setTimepoint(dataset[newTimeIndex])
    }

    const StyledSlider = styled.input`
      width: ${width - offset}px;
      margin: 0 0 0 ${offset}px;
    `

    return (
      <StyledSlider
        type="range"
        min={0}
        max={dataset.length - 1}
        defaultValue={
          sliderRef.current ? sliderRef.current.value : dataset.length - 1
        }
        onChange={onChangeHandler}
        ref={sliderRef}
      />
    )
  }, [width, dataset, setTimepoint])

  const Container = styled.div`
    margin: ${({ theme }) => theme.spacing(2)} -${offset / 2}px;
  `
  const PathsContainer = styled.div`
    position: relative;
  `
  const Label = styled.div`
    position: absolute;
    text-transform: uppercase;
    font-family: plex-sans;
    font-weight: 500;
    font-size: 8pt;
    color: ${({ theme }) => theme.color('dark', 'light')};
    left: ${({ theme }) => theme.spacing()};
  `
  const DataInLabel = styled(Label)`
    top: 0;
  `
  const DataOutLabel = styled(Label)`
    bottom: 0;
  `

  return (
    <Container>
      <PathsContainer>
        <DataInLabel>Data in</DataInLabel>
        <TimelinePaths
          pathDefs={dataInPathDefs}
          svgHeight={svgHeight}
          colorKey="primary"
        />
      </PathsContainer>
      <div>{prerenderedSlider}</div>
      <PathsContainer>
        <DataOutLabel>Data out</DataOutLabel>
        <TimelinePaths
          pathDefs={dataOutPathDefs}
          svgHeight={svgHeight}
          colorKey="secondary"
        />
      </PathsContainer>
    </Container>
  )
}

Timeline.propTypes = {
  width: T.number,
  height: T.number,
}

export default withResizeDetector(Timeline)
