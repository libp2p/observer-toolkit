import React from 'react'

const SvgCancel = props => (
  <svg viewBox="0 0 96 96" {...props}>
    <defs>
      <style>
        {
          '.cancel_svg__cls-2{fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-width:4px}'
        }
      </style>
    </defs>
    <path
      d="M48.31 18.82a29.49 29.49 0 11-29.49 29.49 29.52 29.52 0 0129.49-29.49m0-4a33.49 33.49 0 1033.48 33.49 33.48 33.48 0 00-33.48-33.49z"
      fill="currentColor"
    />
    <path
      className="cancel_svg__cls-2"
      d="M59.21 37.13l-21.8 21.54M37.41 37.13l21.8 21.54"
    />
  </svg>
)

export default SvgCancel
