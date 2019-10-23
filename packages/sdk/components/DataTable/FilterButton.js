import React, { useState } from 'react'
import T from 'prop-types'

import Icon from '../Icon'

function FilterButton({ updateValues, FilterUi }) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <button>
      <Icon type="filter" onClick={toggleOpen} offset />
      <FilterUi onChange={updateValues} isOpen={isOpen} />
    </button>
  )
}

FilterButton.propTypes = {
  updateValues: T.func.isRequired,
  FilterUi: T.elementType.isRequired,
}

export default FilterButton
