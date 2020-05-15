import * as React from 'react'

function SvgSort(props) {
  return (
    <svg
      viewBox="0 0 100 125"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={1.414}
      {...props}
    >
      <path d="M56.491 64.878l-4.409-4.409a1.5 1.5 0 10-2.121 2.121l6.964 6.964a1.5 1.5 0 002.121 0l6.956-6.956a1.5 1.5 0 10-2.121-2.121l-4.39 4.389V41.499a1.503 1.503 0 00-1.5-1.5 1.503 1.503 0 00-1.5 1.5v23.379zm-13.06-29.763l4.409 4.408a1.5 1.5 0 102.121-2.121l-6.963-6.964a1.502 1.502 0 00-2.122 0l-6.956 6.956a1.5 1.5 0 102.122 2.122l4.389-4.39v23.367a1.498 1.498 0 001.5 1.5 1.5 1.5 0 001.5-1.5V35.115z" />
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

export default SvgSort
