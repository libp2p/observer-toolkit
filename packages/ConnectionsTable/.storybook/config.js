import React from 'react'
import styled from 'styled-components'
import { configure } from '@storybook/react'
import { setAddon, addDecorator } from '@storybook/react'

console.log('BEFORE IMPORT')
import { StorybookWrapper } from 'sdk'
console.log('AFTER IMPORT')

addDecorator(renderStory => <StorybookWrapper>{renderStory()}</StorybookWrapper>)

// Import all .stories.js files from /components
configure(require.context('../components', true, /\.stories\.js$/), module)
