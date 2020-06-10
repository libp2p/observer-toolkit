import React from 'react'
import T from 'prop-types'

import DataDemoWrapper from './DataDemoWrapper'
import ShellInnerWrapper from './ShellInnerWrapper'

function ShellDemoWrapper({ children, sample, sampleIndex, deserialize }) {
  return (
    <DataDemoWrapper
      sample={sample}
      sampleIndex={sampleIndex}
      deserialize={deserialize}
    >
      <ShellInnerWrapper>{children}</ShellInnerWrapper>
    </DataDemoWrapper>
  )
}

ShellDemoWrapper.propTypes = {
  children: T.node.isRequired,
  sampleIndex: T.number,
  sample: T.object,
  deserialize: T.func,
}

export default ShellDemoWrapper
