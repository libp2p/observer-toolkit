import { useContext, useEffect, useReducer, useState } from 'react'

import {
  getRuntimeEventTypes,
  getRuntimeEventProperties,
} from '@libp2p-observer/data'
import { RuntimeContext } from '@libp2p-observer/sdk'

function _getPropertyTypes(runtime) {
  const eventTypes = getRuntimeEventTypes(runtime)
  const propertyTypes = getRuntimeEventProperties({ eventTypes })
  return propertyTypes
}

function updatePropertyTypes(oldPropertyTypes, { action, data }) {
  switch (action) {
    case 'clear':
      return []
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
  const [unappliedPropertyTypes, setUnappliedPropertyTypes] = useState(null)
  const [propertyTypes, dispatchPropertyTypes] = useReducer(
    updatePropertyTypes,
    []
  )

  useEffect(() => {
    if (!runtime && !runtimeState) {
      return
    }

    if (!runtime && runtimeState) {
      setRuntimeState(null)
      dispatchPropertyTypes({ action: 'clear' })
      return
    }

    if (runtime && !runtimeState) {
      const propertyTypes = _getPropertyTypes(runtime)

      dispatchPropertyTypes({
        action: 'applyMultiple',
        data: propertyTypes,
      })

      setRuntimeState(runtime)
      return
    }

    if (runtime.getPeerId() !== runtimeState.getPeerId()) {
      setRuntimeState(runtime)
      dispatchPropertyTypes({ action: 'clear' })
      return
    }

    if (runtime !== runtimeState) {
      const oldPropertyTypes = _getPropertyTypes(runtimeState)
      const currentPropertyTypes = _getPropertyTypes(runtime)

      const newPropertyTypes = currentPropertyTypes.filter(
        property =>
          !oldPropertyTypes.some(
            oldProperty => property.name === oldProperty.name
          )
      )

      if (newPropertyTypes.length) {
        setUnappliedPropertyTypes(newPropertyTypes)
      }
    }
  }, [
    runtime,
    runtimeState,
    dispatchPropertyTypes,
    setRuntimeState,
    setUnappliedPropertyTypes,
  ])

  return {
    propertyTypes,
    dispatchPropertyTypes,
    unappliedPropertyTypes,
    setUnappliedPropertyTypes,
  }
}

export default useEventPropertyTypes
