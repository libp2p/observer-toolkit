import React, { useState } from 'react'
import styled from 'styled-components'

import DataTrayItem from './DataTrayItem'
import SamplesList from './SamplesList'

const Container = styled.section`
  background: ${({ theme }) => theme.color('contrast', 1)};
  padding: 0 12%;
  border-left: solid transparent 60px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

function DataTray() {
  const [selectedIndex, setSelectedIndex] = useState(false)
  const deselect = e => {
    e.stopPropagation()
    setSelectedIndex(null)
  }

  // TODO: set setSelected using dataset metadata if available, in useEffect?

  const items = [
    {
      name: 'Sample data',
      iconType: 'cloud',
      description: 'Try this now, using pre-made data samples',
      DataSelector: SamplesList,
    },
    {
      name: 'Upload a file',
      iconType: 'doc',
      description: 'Import lip2p-introspection protobuf data',
      DataSelector: () => <div />,
    },
    {
      name: 'Live connection',
      iconType: 'play',
      description: 'Connect to LibP2P via a local websocket',
      DataSelector: () => <div />,
    },
  ]

  return (
    <Container>
      {items.map(({ name, iconType, description, DataSelector }, index) => {
        const isSelected = selectedIndex === index
        const select = () => setSelectedIndex(index)
        return (
          <DataTrayItem
            isSelected={isSelected}
            select={select}
            deselect={deselect}
            name={name}
            description={description}
            iconType={iconType}
            key={name}
          >
            {isSelected && <DataSelector />}
          </DataTrayItem>
        )
      })}
    </Container>
  )
}

export default DataTray
