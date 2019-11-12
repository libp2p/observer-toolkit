import React from 'react'
import T from 'prop-types'
import { ThemeSetter, DataProvider } from '@libp2p-observer/sdk'

function ContextWrappers({ children }) {
  return (
    <ThemeSetter>
      <DataProvider>{children}</DataProvider>
    </ThemeSetter>
  )
}
ContextWrappers.propTypes = {
  children: T.node,
}

export default ContextWrappers
