import * as React from 'react'

function SvgDesc(props) {
  return (
    <svg
      viewBox="0 0 100 125"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={1.414}
      {...props}
    >
      <path d="M48.506 64.843l-4.41-4.41a1.5 1.5 0 10-2.121 2.121l6.965 6.965a1.5 1.5 0 002.12 0l6.957-6.956a1.5 1.5 0 10-2.121-2.121l-4.39 4.389V31.464a1.503 1.503 0 00-1.5-1.5 1.503 1.503 0 00-1.5 1.5v33.379z" />
      <text
        y={115}
        fontSize={5}
        fontWeight="bold"
        fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
      >
        {'Created by Ryo Sato'}
      </text>
      <text
        y={120}
        fontSize={5}
        fontWeight="bold"
        fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
      >
        {'from the Noun Project'}
      </text>
    </svg>
  )
}

export default SvgDesc
