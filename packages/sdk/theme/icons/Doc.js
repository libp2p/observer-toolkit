import * as React from 'react'

function SvgDoc(props) {
  return (
    <svg viewBox="0 0 96 96" {...props}>
      <defs>
        <style>
          {
            '.doc_svg__cls-2{fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-width:4px}'
          }
        </style>
      </defs>
      <g id="doc_svg__Layer_25" data-name="Layer 25">
        <path
          d="M66.53 18.76a8 8 0 018 8v42.48a8 8 0 01-8 8H29.47a8 8 0 01-8-8V26.76a8 8 0 018-8h37.06m0-4H29.47a12 12 0 00-12 12v42.48a12 12 0 0012 12h37.06a12 12 0 0012-12V26.76a12 12 0 00-12-12z"
          fill="currentColor"
        />
        <path
          className="doc_svg__cls-2"
          d="M30.94 32.81h34.12M30.94 45h34.12M30.94 57.2h34.12"
        />
      </g>
    </svg>
  )
}

export default SvgDoc
