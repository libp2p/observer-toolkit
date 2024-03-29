import React from 'react'
import styled from 'styled-components'
import { configure, addDecorator } from '@storybook/react'
import {
  ThemeWrapper,
  DataDemoWrapper,
  ShellDemoWrapper,
} from '@libp2p/observer-testing'

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
  return <Wrapper>{render()}</Wrapper>
})

// Import all .stories.js files from /components
configure(require.context('../components', true, /\.stories\.js$/), module)
