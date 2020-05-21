import { getStringSorter, getNumericSorter } from '@libp2p/observer-sdk'

import {
  RenderMultiple,
  RenderString,
  RenderPeerId,
  RenderNumber,
  RenderTime,
} from '../components/contentRenderers'
import { ShowJsonButton } from '../components/cellContent'

const stringSorter = {
  getSorter: getStringSorter,
  defaultDirection: 'asc',
}

const numericSorter = {
  getSorter: getNumericSorter,
  defaultDirection: 'desc',
}

function getRenderer(type) {
  switch (type) {
    case 'STRING':
      return {
        renderContent: RenderString,
        sort: stringSorter,
      }
    case 'NUMBER':
      return {
        renderContent: RenderNumber,
        sort: numericSorter,
      }
    case 'TIME':
      return {
        renderContent: RenderTime,
        sort: numericSorter,
      }
    case 'PEERID':
      return {
        renderContent: RenderPeerId,
        sort: stringSorter,
      }
    case 'JSON':
      return {
        renderContent: ShowJsonButton,
        sort: stringSorter,
      }
    default:
      throw new Error(`No renderer defined for event type "${type}"`)
  }
}

function _getColumns(propertyTypes, dispatchPropertyTypes) {
  return propertyTypes.reduce((columns, typeData) => {
    if (!typeData.enabled) return columns

    const { name, hasMultiple, type } = typeData

    const getPropsValue = event => JSON.parse(event.getContent())[name] || ''

    let newColumn
    if (hasMultiple) {
      newColumn = {
        name,
        renderContent: RenderMultiple,
        getProps: (event, { hidePrevious }) => ({
          value: getPropsValue(event),
          sortValue: getPropsValue(event).length,
          type,
          name,
          hidePrevious,
        }),
        sort: numericSorter,
      }
    } else {
      const { renderContent, sort } = getRenderer(type)

      newColumn = {
        name,
        getProps: (event, { hidePrevious }) => ({
          value: getPropsValue(event),
          hidePrevious,
        }),
        renderContent,
        sort,
      }
    }

    return [...columns, newColumn]
  }, [])
}

function buildEventsColumns(
  eventsColumnDefs,
  propertyTypes,
  dispatchPropertyTypes
) {
  const lastColumn = eventsColumnDefs.length - 1

  const newColumnDefs = [
    ...eventsColumnDefs.slice(0, lastColumn),
    ..._getColumns(propertyTypes, dispatchPropertyTypes),
    eventsColumnDefs[lastColumn],
  ]

  return newColumnDefs
}

export default buildEventsColumns
export { getRenderer }
