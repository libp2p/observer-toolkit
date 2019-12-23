import React from 'react'

import ContextWrappers from './components/ContextWrappers'
import Router from './Router'

function App() {
  return (
    <ContextWrappers>
      <Router />
    </ContextWrappers>
  )
}

export default App
