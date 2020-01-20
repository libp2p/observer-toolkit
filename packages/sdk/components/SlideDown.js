import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { SlideDown as ReactSlideDown } from 'react-slidedown'

// Minimise side effects: hiding overflow is only necessary during transition
const SlideDownSection = styled(ReactSlideDown)`
  ${({ theme }) => theme.transition()}
  &.transitioning {
    overflow: hidden;
  }
`

function SlideDown({ isOpen = false, children }) {
  // While transitioning out, content is purely aesthetic: remove from semantic tree.
  // Also allows us to detect complete closes in tests (react-slidedown reads full CSS)
  const ariaHidden = !isOpen

  return (
    <SlideDownSection aria-hidden={ariaHidden}>{children}</SlideDownSection>
  )
}

SlideDown.propTypes = {
  isOpen: T.bool,
  children: T.node.isRequired,
}

export default SlideDown
