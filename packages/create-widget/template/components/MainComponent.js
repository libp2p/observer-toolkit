import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

const StyledExample = styled.div`
  background: ${({ theme }) => theme.color('light', 'mid')};
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing()};
  ${({ theme }) => theme.text('body', 'large')}
`

function $WIDGET_COMPONENT({ children }) {
  // Function component logic here
  // Use the React Hooks model, see https://reactjs.org/docs/hooks-intro.html

  return (
    <StyledExample>
      Your component content here
      {children}
    </StyledExample>
  )
}

$WIDGET_COMPONENT.propTypes = {
  children: T.node,
}

export default $WIDGET_COMPONENT
