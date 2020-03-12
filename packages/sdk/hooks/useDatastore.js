import { useCallback, useContext } from 'react'

import { SetterContext, SourceContext } from '../components/context'

function useDatastore(type) {
  const source = useContext(SourceContext)
  const { dispatchStates, dispatchEvents, setRuntime, setSource } = useContext(
    SetterContext
  )

  const updateSource = useCallback(
    ({ name, type }) => {
      if (!source || type !== source.type || name !== source.name) {
        setSource({ name, type })
      }
    },
    [source, setSource]
  )

  const updateData = useCallback(
    ({ states = [], events = [], runtime }) => {
      if (states.length)
        dispatchStates({
          action: 'append',
          data: states,
        })
      if (events.length)
        dispatchEvents({
          action: 'append',
          data: events,
        })
      if (runtime) setRuntime(runtime)
    },
    [dispatchStates, dispatchEvents, setRuntime]
  )

  const replaceData = useCallback(
    ({ states = [], events = [], runtime }) => {
      dispatchStates({
        action: states.length ? 'replace' : 'remove',
        data: states,
      })
      dispatchEvents({
        action: events.length ? 'replace' : 'remove',
        data: events,
      })
      setRuntime(runtime)
    },
    [dispatchStates, dispatchEvents, setRuntime]
  )

  const removeData = useCallback(() => {
    dispatchStates({ action: 'remove' })
    dispatchEvents({ action: 'remove' })
    setRuntime(undefined)
  }, [dispatchStates, dispatchEvents, setRuntime])

  return {
    updateSource,
    updateData,
    replaceData,
    removeData,
  }
}

export default useDatastore
