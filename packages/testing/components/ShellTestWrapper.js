import React from 'react'

import DataTestWrapper from './DataTestWrapper'
import ShellInnerWrapper from './ShellInnerWrapper'

function ShellTestWrapper({ children }) {
  return (
    <DataTestWrapper>
      <ShellInnerWrapper>{children}</ShellInnerWrapper>
    </DataTestWrapper>
  )
}

export default ShellTestWrapper
