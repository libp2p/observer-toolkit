import React from 'react'
import T from 'prop-types'

import DataTestWrapper from './DataTestWrapper'
import ShellInnerWrapper from './ShellInnerWrapper'

function ShellTestWrapper({ providers, children }) {
  return (
    <DataTestWrapper contexts={providers}>
      <ShellInnerWrapper contexts={providers}>{children}</ShellInnerWrapper>
    </DataTestWrapper>
  )
}

ShellTestWrapper.propTypes = {
  providers: T.object,
  children: T.node.isRequired,
}

export default ShellTestWrapper
