import React, { useContext, useEffect, useState } from 'react'

import {
  DataContext,
  RuntimeContext,
  SourceContext,
} from '@nearform/observer-sdk'

import { Connected, Home } from './pages'

function testHasData(states, runtime, source) {
  return !!runtime && states.length > 1
}

// This is a very basic switcher for now
// TODO: When implementing pages (about us etc), use a real URL router
function Router() {
  const states = useContext(DataContext)
  const runtime = useContext(RuntimeContext)
  const source = useContext(SourceContext)
  const [hasData, setHasData] = useState(() => testHasData(states, runtime))

  useEffect(() => {
    document.title = 'LibP2P Observation Deck'

    const currentlyHasData = testHasData(states, runtime)
    if (!hasData && currentlyHasData) setHasData(true)
    if (hasData && !currentlyHasData && !source.name) setHasData(false)
  }, [hasData, states, runtime, source])

  return hasData ? <Connected /> : <Home />
}

export default Router
