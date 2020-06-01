import { useCallback, useEffect } from 'react'
import T from 'prop-types'

// Adds an event handler to a ref as a side effect of mounting this
// hook's parent, and removes it if this hook's parent is unmounted
function useHandlerOnRef(props) {
  T.checkPropTypes(useHandlerOnRef.propTypes, props, 'prop', 'useHandlerOnRef')
  const {
    handler,
    targetRef,
    eventType = 'click',
    className = 'clickable',
  } = props

  const cleanupBinding = useCallback(() => {
    if (targetRef && targetRef.current) {
      targetRef.current.removeEventListener(eventType, handler)
      if (className) targetRef.current.classList.remove(className)
    }
  }, [targetRef, handler, eventType, className])

  useEffect(() => {
    if (targetRef && targetRef.current) {
      targetRef.current.addEventListener(eventType, handler)
      if (className) targetRef.current.classList.add(className)
    }
    return cleanupBinding
  }, [targetRef, handler, eventType, className, cleanupBinding])
}

useHandlerOnRef.propTypes = {
  handler: T.func.isRequired,
  targetRef: T.object,
  eventType: T.string,
  className: T.string,
}

export default useHandlerOnRef
