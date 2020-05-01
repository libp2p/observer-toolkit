import { useState } from 'react'

function useHidePrevious(initialHideFn = null) {
  // setState can't store functions, so, encase it in an object wrapper
  const [hide, setHide] = useState({ fn: initialHideFn })

  const hidePrevious = newHideFn => {
    if (hide.fn) hide.fn()
    setHide({ fn: newHideFn })
  }

  return hidePrevious
}

export default useHidePrevious
