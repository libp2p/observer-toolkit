import React from 'react'
import T from 'prop-types'
import {
  ThemeSetter,
  DataProvider,
  FilterProvider,
} from '@nearform/observer-sdk'

function ContextWrappers({ children, theme }) {
  return (
    <ThemeSetter theme={theme}>
      <FilterProvider>
        <DataProvider>{children}</DataProvider>
      </FilterProvider>
    </ThemeSetter>
  )
}
ContextWrappers.propTypes = {
  children: T.node,
  theme: T.object,
}

export default ContextWrappers
