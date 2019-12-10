import React, { createContext, useRef, useState } from 'react'
import T from 'prop-types'
import styled from 'styled-components'

const RootNodeContext = createContext()

const Container = styled.div`
  width: inherit;
  height: inherit;
  display: inherit;
  flex-direction: inherit;
`

function RootNodeProvider({ children }) {
  const rootNodeRef = useRef()

  // Re-render listeners when ref is available
  const [refState, setRefState] = useState({})
  if (rootNodeRef.current && !refState.current) setRefState(rootNodeRef)

  return (
    <Container ref={rootNodeRef}>
      <RootNodeContext.Provider value={refState}>
        {children}
      </RootNodeContext.Provider>
    </Container>
  )
}

RootNodeProvider.propTypes = {
  children: T.node.isRequired,
}

export { RootNodeContext, RootNodeProvider }
