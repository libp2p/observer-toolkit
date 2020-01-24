import React from 'react'
import T from 'prop-types'

import DataDemoWrapper from './DataDemoWrapper'
import ShellInnerWrapper from './ShellInnerWrapper'

function ShellDemoWrapper({ children }) {
  return (
    <DataDemoWrapper>
      <ShellInnerWrapper>{children}</ShellInnerWrapper>
    </DataDemoWrapper>
  )
}

ShellDemoWrapper.propTypes = {
  children: T.node.isRequired,
}

export default ShellDemoWrapper
