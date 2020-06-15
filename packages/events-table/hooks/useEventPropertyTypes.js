import { useContext, useEffect, useReducer, useState } from 'react'

import {
  getRuntimeEventTypes,
  getRuntimeEventProperties,
} from '@libp2p/observer-data'
import { RuntimeContext } from '@libp2p/observer-sdk'

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
      return updatePropertyType(oldPropertyTypes, data, true)
    case 'disable':
      return updatePropertyType(oldPropertyTypes, data, false)
    default:
      throw new Error(`updatePropertyTypes has no action "${action}"`)
  }
}

function applyMultiplePropertyTypes(oldPropertyTypes, newPropertyTypes) {
  const updatedPropertyTypes = newPropertyTypes.reduce(
    (propertyTypes, typeData) => {
      return updatePropertyType(propertyTypes, typeData)
    },
    oldPropertyTypes
  )
  return updatedPropertyTypes
}

function updatePropertyType(
  oldPropertyTypes,
  { name, eventTypes, type, hasMultiple },
  enabled = false
) {
  const matchIndex = oldPropertyTypes.findIndex(
    prop => prop.name === name && prop.type === type
  )
  if (matchIndex >= 0) {
    const match = oldPropertyTypes[matchIndex]
    const newTypes = [...oldPropertyTypes]
    newTypes[matchIndex] = { ...match, enabled }
    return newTypes
  } else {
    return [
      ...oldPropertyTypes,
      { name, eventTypes, type, hasMultiple, enabled },
    ]
  }
}

function useEventPropertyTypes() {
  const runtime = useContext(RuntimeContext)
  const [runtimeState, setRuntimeState] = useState()

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
      dispatchPropertyTypes({
        action: 'applyMultiple',
        data: newPropertyTypes,
      })

      setRuntimeState(runtime)
    }
  }, [runtime, dispatchPropertyTypes, runtimeState])

  return {
    propertyTypes,
    dispatchPropertyTypes,
  }
}

export default useEventPropertyTypes
