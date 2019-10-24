import React from 'react'

import ContextWrappers from './components/ContextWrappers'
import Page from './components/Page'

function App() {
  return (
    <ContextWrappers>
      <Page />
    </ContextWrappers>
  )
}

export default App
