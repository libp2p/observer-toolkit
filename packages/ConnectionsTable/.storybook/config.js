import React from 'react'
import styled from 'styled-components'
import { configure } from '@storybook/react'
import { setAddon, addDecorator } from '@storybook/react'

import { StorybookWrapper } from 'sdk'

addDecorator(renderStory => <StorybookWrapper>{renderStory()}</StorybookWrapper>)

// Import all .stories.js files from /components
configure(require.context('../components', true, /\.stories\.js$/), module)
