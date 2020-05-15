import * as React from 'react'

function SvgMarker(props) {
  return (
    <svg viewBox="0 0 96 96" {...props}>
      <defs>
        <style>
          {
            '.marker_svg__cls-1{fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-width:4px}'
          }
        </style>
      </defs>
      <path
        className="marker_svg__cls-1"
        d="M71.71 40.14c0 14.35-23.4 40.33-23.4 40.33S24.9 54.49 24.9 40.14s10.48-24 23.41-24 23.4 9.65 23.4 24z"
      />
      <circle className="marker_svg__cls-1" cx={48.31} cy={39.22} r={6.9} />
    </svg>
  )
}

export default SvgMarker
