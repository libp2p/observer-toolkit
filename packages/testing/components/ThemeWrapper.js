import React from 'react'
import T from 'prop-types'

import {
  FilterProvider,
  RootNodeProvider,
  ThemeSetter,
} from '@nearform/observer-sdk'

function ThemeWrapper({ providers = {}, children }) {
  const _RootNodeProvider = providers.RootNodeProvider || RootNodeProvider
  const _FilterProvider = providers.FilterProvider || FilterProvider
  return (
    <ThemeSetter>
      <_RootNodeProvider>
        <_FilterProvider>{children}</_FilterProvider>
      </_RootNodeProvider>
    </ThemeSetter>
  )
}

ThemeWrapper.propTypes = {
  providers: T.object,
  children: T.node.isRequired,
}

export default ThemeWrapper
