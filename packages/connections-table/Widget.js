import React from 'react'
import T from 'prop-types'

import { ActiveWidget } from '@nearform/observer-shell'
import { name, description } from './metadata'
import WidgetContext from './components/context/WidgetContext'
import ConnectionsTable from './components/ConnectionsTable'

function Widget({ closeWidget }) {
  return (
    <WidgetContext>
      <ActiveWidget
        name={name}
        description={description}
        closeWidget={closeWidget}
      >
        <ConnectionsTable />
      </ActiveWidget>
    </WidgetContext>
  )
}

Widget.propTypes = {
  closeWidget: T.func,
}

export default Widget
