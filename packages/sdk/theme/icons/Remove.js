import * as React from 'react'

function SvgRemove(props) {
  return (
    <svg viewBox="16 16 64 64" {...props}>
      <defs>
        <style>
          {
            '.remove_svg__cls-2{fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-width:2.5px}'
          }
        </style>
      </defs>
      <path
        className="remove_svg__cls-2"
        d="M59.21 37.13l-21.8 21.54M37.41 37.13l21.8 21.54"
      />
    </svg>
  )
}

export default SvgRemove
