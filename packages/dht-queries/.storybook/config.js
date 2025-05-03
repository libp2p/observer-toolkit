import React from 'react'
import styled from 'styled-components'
import { configure, addDecorator } from '@storybook/react'
import {
  ThemeWrapper,
  DataDemoWrapper,
  ShellDemoWrapper,
} from '@libp2p/observer-testing'
import WidgetContext from '../components/context/WidgetContext'

import sampleUrl from '../test-fixtures/sample-dht-2min.mock'

function getWrapper(wrapper) {
  switch (wrapper) {
    case 'shell':
      return ShellDemoWrapper
    case 'data':
      return DataDemoWrapper
    case 'theme':
      return ThemeWrapper
    default:
      throw new Error(`Unrecognised wrapper "${wrapper}"`)
  }
}

addDecorator((render, { parameters }) => {
  const Wrapper = getWrapper(parameters.wrapper || 'shell')
  return (
    <Wrapper sample={sampleUrl}>
      <WidgetContext>{render()}</WidgetContext>
    </Wrapper>
  )
})

// Import all .stories.js files from /components
configure(require.context('../components', true, /\.stories\.js$/), module)
