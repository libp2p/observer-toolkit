import React, { useState } from 'react'
import T from 'prop-types'

import styled from 'styled-components'

function CatalogueItem({ Component }) {
  const [isOpen, setIsOpen] = useState(false)

  const openStyles = styled.css(``)
  const styledDiv = styled.div`
    ${isOpen && openStyles}
  `

  return (
    <styledDiv>
      <Component />
    </styledDiv>
  )
}

CatalogueItem.propTypes = {
  Component: T.node,
}

export default CatalogueItem
