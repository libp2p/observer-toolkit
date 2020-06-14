import * as React from 'react'

function SvgMixed(props) {
  return (
    <svg viewBox="0 0 96 96" {...props}>
      <path
        d="M48 19a29 29 0 11-29 29 29 29 0 0129-29m0-4a33 33 0 1033 33 33 33 0 00-33-33z"
        fill="currentColor"
      />
      <circle fill="currentColor" cx="48" cy="48" r="6" />
    </svg>
  )
}

export default SvgMixed
