import * as React from 'react'

function SvgEdit(props) {
  return (
    <svg viewBox="0 0 96 96" {...props}>
      <defs>
        <style>
          {
            '.edit_svg__cls-1{fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-width:4px}'
          }
        </style>
      </defs>
      <g id="edit_svg__Layer_13" data-name="Layer 13">
        <path className="edit_svg__cls-1" d="M23.63 57.63l14.74 14.74" />
        <path
          d="M69.72 18.84a7.5 7.5 0 015.1 2.34c2.24 2.23 3 5.45 1.74 7.28L73.05 32 31.49 73.6l-12.09 3 3-12.09L63.94 23l3.6-3.54a4 4 0 012.18-.6m0-4a7.71 7.71 0 00-4.78 1.55l-3.8 3.73-42.35 42.33-3.88 15.6a2.49 2.49 0 002.41 3.09 2.6 2.6 0 00.61-.07l15.6-3.88 42.35-42.35 3.73-3.8c2.64-3.4 1.86-8.9-2-12.71a11.44 11.44 0 00-7.93-3.51z"
          fill="currentColor"
        />
        <path className="edit_svg__cls-1" d="M60.84 24.74l10.64 10.64" />
      </g>
    </svg>
  )
}

export default SvgEdit
