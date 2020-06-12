import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import Icon from '../Icon'

const IconContainer = styled.span`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  display: inline-block;
  vertical-align: middle;
  ${({ theme, hover }) =>
    hover ? `color: ${theme.color('secondary', 0)};` : ''}
  ${({ theme, isSorted }) =>
    isSorted && theme.transition({ property: 'transform' })}
  transform: rotate(${({ rotation }) => rotation}deg);
`

const iconSize = '2em'

function SortIcon({
  isSorted,
  hover,
  columnDef,
  sortDirection,
  sortDirectionOnClick,
  override = {},
}) {
  const sortIconDirection = hover ? sortDirectionOnClick : sortDirection
  const sortIconRotation = sortIconDirection === 'asc' ? 90 : 270

  const sortIconType = hover || isSorted ? 'back' : null

  return (
    <IconContainer
      hover={hover}
      rotation={sortIconRotation}
      isSorted={isSorted}
      size={iconSize}
      as={override.IconContainer}
    >
      <Icon type={sortIconType} size={iconSize} />
    </IconContainer>
  )
}

SortIcon.propTypes = {
  isSorted: T.bool,
  hover: T.bool,
  columnDef: T.object.isRequired,
  sortDirection: T.string,
  sortDirectionOnClick: T.string,
  override: T.object,
}

export default SortIcon
