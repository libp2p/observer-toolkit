import React from 'react'
import T from 'prop-types'
import { ThemeSetter, RootNodeProvider } from '@libp2p-observer/sdk'

function ThemeTestWrapper({ children }) {
  // Minimal wrapper needed to test a component
  return (
    <ThemeSetter>
      <RootNodeProvider>{children}</RootNodeProvider>
    </ThemeSetter>
  )
}

ThemeTestWrapper.propTypes = {
  children: T.node.isRequired,
}

export default ThemeTestWrapper
