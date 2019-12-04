import React from 'react'
import styled from 'styled-components'
import { configure, addDecorator } from '@storybook/react'
import { DemoShell } from '@libp2p-observer/shell'

addDecorator(renderStory => <DemoShell>{renderStory()}</DemoShell>)

// Import all .stories.js files from /components
configure(require.context('../components', true, /\.stories\.js$/), module)
