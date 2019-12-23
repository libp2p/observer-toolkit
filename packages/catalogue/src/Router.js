import React, { useContext, useEffect } from 'react'

import { DataContext } from '@libp2p-observer/sdk'

import { Connected, Home } from './pages'

// This is a very basic switcher for now
// TODO: When implementing pages (about us etc), use a real URL router
function Router() {
  const dataset = useContext(DataContext)

  console.log('dataset', dataset)

  useEffect(() => {
    document.title = 'LibP2P Observation Deck'
  }, [])

  return dataset.length ? <Connected /> : <Home />
}

export default Router
