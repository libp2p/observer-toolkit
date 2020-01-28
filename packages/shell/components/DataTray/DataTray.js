import React, { useContext, useEffect, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import get from 'lodash.get'

import { DataContext, Icon, UploadDataButton } from '@libp2p-observer/sdk'
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

const ActiveData = styled.div`
  ${({ theme }) => theme.text('heading', 'medium')}
  margin-left: ${({ theme }) => theme.spacing(-2)};
  cursor: pointer;
`

const ActiveDataIcon = styled.button`
  margin-right: ${({ theme }) => theme.spacing()};
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
    Component: () => <div />,
  },
]

function DataTray({ onLoad }) {
  const states = useContext(DataContext)
  const [isUnset, setIsUnset] = useState(false)
  const activeType = get(states, 'metadata.type')
  const activeName = get(states, 'metadata.name')

  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    if (!activeType || isUnset) return
    const index = items.findIndex(({ type }) => type === activeType)
    if (index !== selectedIndex) {
      if (typeof selectedIndex === 'number') {
        setIsUnset(true)
      } else {
        setIsUnset(false)
        setSelectedIndex(index)
      }
    }
  }, [activeType, isUnset, selectedIndex])

  const deselect = e => {
    e.stopPropagation()
    setIsUnset(true)
    setSelectedIndex(null)
  }

  const reselect = e => {
    const index = selectedIndex
    deselect(e)
    setSelectedIndex(index)
  }

  return (
    <Container>
      {items.map(({ name, iconType, description, Component }, index) => {
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
            {isSelected &&
              (activeName && !isUnset ? (
                <ActiveData onClick={reselect}>
                  <Icon
                    type="remove"
                    override={{ Container: ActiveDataIcon }}
                  />
                  {activeType}: <b>{activeName}</b>
                </ActiveData>
              ) : (
                <Component onLoad={onLoad} />
              ))}
          </DataTrayItem>
        )
      })}
    </Container>
  )
}

DataTray.propTypes = {
  onLoad: T.func,
}

export default DataTray
