import * as React from 'react'

function SvgAsc(props) {
  return (
    <svg
      viewBox="0 0 100 125"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={1.414}
      {...props}
    >
      <path d="M51.494 35.157l4.41 4.409a1.5 1.5 0 102.121-2.121l-6.965-6.964a1.5 1.5 0 00-2.12 0l-6.957 6.956a1.5 1.5 0 102.121 2.121l4.39-4.389v33.367a1.503 1.503 0 001.5 1.5 1.503 1.503 0 001.5-1.5V35.157z" />
      <text
        y={115}
        fill="#000"
        fontSize={5}
        fontWeight="bold"
        fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
      >
        {'Created by Ryo Sato'}
      </text>
      <text
        y={120}
        fill="#000"
        fontSize={5}
        fontWeight="bold"
        fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
      >
        {'from the Noun Project'}
      </text>
    </svg>
  )
}

export default SvgAsc
