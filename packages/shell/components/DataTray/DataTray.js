import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import {
  RootNodeProvider,
  SetterContext,
  SourceContext,
} from '@nearform/observer-sdk'
import DataTrayItem from './DataTrayItem'
import SamplesList from './SamplesList'
import WebSocketInput from './WebSocketInput'
import UploadDataButton from './UploadDataButton'

const Container = styled.section`
  background: ${({ theme }) => theme.color('contrast', 1)};
  padding: 0 12%;
  border-left: solid transparent 60px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const items = [
  {
    name: 'Sample data',
    type: 'sample',
    iconType: 'cloud',
    description: 'Try this now, using pre-made data samples',
    Component: SamplesList,
  },
  {
    name: 'Upload a file',
    type: 'upload',
    iconType: 'doc',
    description: 'Import lip2p-introspection protobuf data',
    Component: UploadDataButton,
  },
  {
    name: 'Live connection',
    type: 'live',
    iconType: 'play',
    description: 'Connect to libp2p via a local websocket',
    Component: WebSocketInput,
  },
]

function getInitialIndex(source, initialSourceType) {
  const sourceType = source.type || initialSourceType
  if (!sourceType) return null
  const index = items.findIndex(({ type }) => type === sourceType)
  return index !== -1 ? index : null
}

function DataTray({ handleNewData, initialSourceType }) {
  const source = useContext(SourceContext)
  const { removeData, updateData, setIsLoading } = useContext(SetterContext)

  const [selectedIndex, setSelectedIndex] = useState(getInitialIndex(source, initialSourceType))

  const deselect = e => {
    e.stopPropagation()
    setSelectedIndex(null)
  }

  const handleUploadChunk = data => updateData(data)
  const handleUploadFinished = () => {
    setIsLoading(false)
    if (handleNewData) handleNewData()
  }
  const handleRemoveData = () => {
    setSelectedIndex(null)
    removeData()
  }

  return (
    <Container>
      <RootNodeProvider>
        {items.map((dataItemProps, index) => {
          const { name, type } = dataItemProps
          const isSelected = selectedIndex === index
          const isLoaded = source.type === type
          const isLoading = isLoaded && source.isLoading

          const select = e => {
            e.stopPropagation()
            setSelectedIndex(index)
          }

          const handleUploadStart = name => {
            removeData({ type, name, isLoading: true })
          }

          return (
            <DataTrayItem
              key={name}
              isSelected={isSelected}
              isLoaded={isLoaded}
              select={select}
              deselect={deselect}
              isLoading={isLoading}
              handleUploadStart={handleUploadStart}
              handleUploadChunk={handleUploadChunk}
              handleUploadFinished={handleUploadFinished}
              handleRemoveData={handleRemoveData}
              {...dataItemProps}
            />
          )
        })}
      </RootNodeProvider>
    </Container>
  )
}

DataTray.propTypes = {
  handleNewData: T.func,
  initialSourceType: T.string,
}

export default DataTray
