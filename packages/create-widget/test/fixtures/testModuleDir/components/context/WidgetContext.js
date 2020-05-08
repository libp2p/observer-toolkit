import React, { useContext } from 'react'
import T from 'prop-types'

import { getStateRangeTimes } from '@libp2p/observer-data'
import {
  getRangeFilter,
  FilterProvider,
  DataContext,
} from '@libp2p/observer-sdk'

// WidgetContext is wrapped arpund every widget and its outer container,
// allowing contexts to share with any component within the widget.
function WidgetContext({ children }) {
  const states = useContext(DataContext)
  const { start, end } = getStateRangeTimes(states)

  // Filter definitions provided to FilterProvider in the WidgetContext
  // will be attached to the widget container's filter tray
  const filterDefs = [
    getRangeFilter({
      name: 'Filter events by event time',
      mapFilter: event => event.getTs(),
      min: start,
      max: end,
      numberFieldType: 'time',
    }),
  ]

  return <FilterProvider filterDefs={filterDefs}>{children}</FilterProvider>
}

WidgetContext.propTypes = {
  children: T.node,
}

export default WidgetContext
