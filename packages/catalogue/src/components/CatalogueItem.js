import React, { useState } from 'react'
import T from 'prop-types'
import ReactMarkdown from 'react-markdown'

import styled from 'styled-components'

function CatalogueItem({ Component, name, description, image, tags }) {
  const [isOpen, setIsOpen] = useState(false)

  const openStyles = styled.css(``)
  const styledDiv = styled.div`
    ${isOpen && openStyles}
  `

  return (
    <styledDiv>
      <h3>{name}</h3>
      <Component />
      <ReactMarkdown source={description} />
      <ul>
        {tags.map(tag => (
          <li>{tag}</li>
        ))}
      </ul>
    </styledDiv>
  )
}

CatalogueItem.propTypes = {
  Component: T.node,
}

export default CatalogueItem
