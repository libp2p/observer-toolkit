import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import WidgetHeader from './WidgetHeader/WidgetHeader'

const Container = styled.article`
  background: ${({ theme }) => theme.color('background')};
  border-radius: ${({ theme }) => theme.spacing()};
  ${({ theme }) => theme.boxShadow({ size: 1.5, opacity: 0.3 })};
  min-height: 320px;
`

const WidgetContainer = styled.section`
  padding: ${({ theme }) => theme.spacing()};
`

function ActiveWidget({ name, description, closeWidget, children }) {
  return (
    <Container>
      <WidgetHeader
        name={name}
        description={description}
        closeWidget={closeWidget}
      />
      <WidgetContainer>{children}</WidgetContainer>
    </Container>
  )
}

ActiveWidget.propTypes = {
  name: T.string.isRequired,
  description: T.string,
  closeWidget: T.func,
  children: T.node.isRequired,
}

export default ActiveWidget
