import React, { useState } from 'react'
import T from 'prop-types'
import ReactMarkdown from 'react-markdown'

import styled from 'styled-components'

function CatalogueItem({ Component, name, description, tags }) {
  const [isOpen, setIsOpen] = useState(false)

  const AccordionContent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    ${!isOpen && 'display: none;'}
  `

  return (
    <div>
      <h3>{name}</h3>
      <AccordionContent>
        <Component />
      </AccordionContent>
      <ReactMarkdown source={description} />
      <ul>
        {tags.map(tag => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  )
}

CatalogueItem.propTypes = {
  Component: T.elementType,
}

export default CatalogueItem
