import * as React from 'react'

function SvgPause(props) {
  return (
    <svg viewBox="0 0 96 96" {...props}>
      <defs>
        <style>
          {
            '.pause_svg__cls-2{fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-width:4px}'
          }
        </style>
      </defs>
      <path
        d="M48.31 18.82a29.49 29.49 0 11-29.49 29.49 29.52 29.52 0 0129.49-29.49m0-4a33.49 33.49 0 1033.48 33.49 33.48 33.48 0 00-33.48-33.49z"
        fill="currentColor"
      />
      <path
        className="pause_svg__cls-2"
        d="M56.21 37.13v21.54M40.41 37.13v21.54"
      />
    </svg>
  )
}

export default SvgPause
