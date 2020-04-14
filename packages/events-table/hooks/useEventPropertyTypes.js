import { useContext, useEffect, useReducer, useState } from 'react'

import { getEventTypes, getAllEventProperties } from '@libp2p-observer/data'
import { RuntimeContext } from '@libp2p-observer/sdk'

function updatePropertyTypes(oldPropertyTypes, { action, data }) {
  switch (action) {
    case 'applyMultiple':
      return applyMultiplePropertyTypes(oldPropertyTypes, data)
    case 'enable':
      return enablePropertyType(oldPropertyTypes, data)
    case 'disable':
      return disablePropertyType(oldPropertyTypes, data)
    default:
      throw new Error(`updatePropertyTypes has no action "${action}"`)
  }
}

function applyMultiplePropertyTypes(oldPropertyTypes, newPropertyTypes) {
  const updatedPropertyTypes = newPropertyTypes.reduce(
    (propertyTypes, typeData) => {
      return enablePropertyType(propertyTypes, typeData)
    },
    oldPropertyTypes
  )
  return updatedPropertyTypes
}

function enablePropertyType(
  oldPropertyTypes,
  { name, eventTypes, type, hasMultiple }
) {
  const matchIndex = oldPropertyTypes.findIndex(
    prop => prop.name === name && prop.type === type
  )
  if (matchIndex >= 0) {
    const match = oldPropertyTypes[matchIndex]
    const newTypes = [...oldPropertyTypes]
    newTypes[matchIndex] = { ...match, enabled: true }
    return newTypes
  } else {
    return [
      ...oldPropertyTypes,
      { name, eventTypes, type, hasMultiple, enabled: true },
    ]
  }
}

function disablePropertyType(oldPropertyTypes, { name, eventTypes, type }) {
  const matchIndex = oldPropertyTypes.findIndex(
    prop => prop.name === name && prop.type === type
  )
  if (matchIndex >= 0) {
    const match = oldPropertyTypes[matchIndex]
    const newTypes = [...oldPropertyTypes]
    newTypes[matchIndex] = { ...match, enabled: false }
    return newTypes
  }
}

function useEventPropertyTypes() {
  const runtime = useContext(RuntimeContext)

  const [runtimeState, setRuntimeState] = useState(null)
  const [propertyTypes, dispatchPropertyTypes] = useReducer(
    updatePropertyTypes,
    []
  )

  useEffect(() => {
    if (runtime !== runtimeState) {
      const eventTypes = getEventTypes(runtime)
      const newPropertyTypes = getAllEventProperties({ eventTypes })

      dispatchPropertyTypes({
        action: 'applyMultiple',
        data: newPropertyTypes,
      })
      setRuntimeState(runtime)
    }
  }, [runtime, runtimeState, dispatchPropertyTypes, setRuntimeState])

  return {
    propertyTypes,
    dispatchPropertyTypes,
  }
}

export default useEventPropertyTypes
