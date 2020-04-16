import React, { useContext, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { SourceContext } from '@libp2p-observer/sdk'
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
    description: 'Connect to LibP2P via a local websocket',
    Component: WebSocketInput,
  },
]

function getInitialIndex(source) {
  if (!source) return null
  return items.findIndex(({ type }) => type === source.type)
}

function DataTray({ onLoad }) {
  const source = useContext(SourceContext)
  const [selectedIndex, setSelectedIndex] = useState(getInitialIndex(source))

  const deselect = e => {
    e.stopPropagation()
    setSelectedIndex(null)
  }

  return (
    <Container>
      {items.map(({ name, type, iconType, description, Component }, index) => {
        const isSelected = selectedIndex === index
        const isLoaded = source && source.type === type
        const select = e => {
          e.stopPropagation()
          setSelectedIndex(index)
        }
        return (
          <DataTrayItem
            isSelected={isSelected}
            isLoaded={isLoaded}
            select={select}
            deselect={deselect}
            name={name}
            type={type}
            description={description}
            iconType={iconType}
            key={name}
            Component={Component}
            onLoad={onLoad}
          />
        )
      })}
    </Container>
  )
}

DataTray.propTypes = {
  onLoad: T.func,
}

export default DataTray
