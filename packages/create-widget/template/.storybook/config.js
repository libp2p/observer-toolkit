import React from 'react'
import styled from 'styled-components'
import { configure, addDecorator } from '@storybook/react'
import { ShellDemoWrapper } from '@libp2p-observer/testing'

addDecorator(renderStory => (
  <ShellDemoWrapper>{renderStory()}</ShellDemoWrapper>
))

// Import all .stories.js files from /components
configure(require.context('../components', true, /\.stories\.js$/), module)
