import React, { useContext, useEffect, useState } from 'react'
import T from 'prop-types'

import {
  DataContext,
  RuntimeContext,
  SourceContext,
} from '@nearform/observer-sdk'

import { Connected, Home } from './pages'

function testHasData(states, runtime, source) {
  return !!runtime || states.length > 1
}

function Router({ widgets, Content, title }) {
  const states = useContext(DataContext)
  const runtime = useContext(RuntimeContext)
  const source = useContext(SourceContext)
  const [hasData, setHasData] = useState(() => testHasData(states, runtime))

  useEffect(() => {
    const currentlyHasData = testHasData(states, runtime)
    if (!hasData && currentlyHasData) setHasData(true)
    if (hasData && !currentlyHasData && !source.name) setHasData(false)
  }, [hasData, states, runtime, source])

  return hasData ? <Connected widgets={widgets} /> : <Home Content={Content} />
}
Router.propTypes = {
  widgets: T.array.isRequired,
  Content: T.elementType,
  title: T.string,
}

export default Router