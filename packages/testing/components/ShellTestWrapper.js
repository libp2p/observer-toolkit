import React from 'react'
import T from 'prop-types'

import DataTestWrapper from './DataTestWrapper'
import ShellInnerWrapper from './ShellInnerWrapper'

function ShellTestWrapper({ children }) {
  return (
    <DataTestWrapper>
      <ShellInnerWrapper>{children}</ShellInnerWrapper>
    </DataTestWrapper>
  )
}

ShellTestWrapper.propTypes = {
  children: T.node.isRequired,
}

export default ShellTestWrapper
