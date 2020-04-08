import { getStringSorter, getNumericSorter } from '@libp2p-observer/sdk'

import {
  RenderString,
  RenderJson,
  RenderPeerId,
  RenderNumber,
  RenderTime,
} from '../components/contentRenderers'
import { EventPropertyHeader } from '../components/cellContent'

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
        renderContent: RenderJson,
        sort: stringSorter,
      }
    default:
      throw new Error(`No renderer defined for event type "${type}"`)
  }
}

function _getColumns(propertyTypes, dispatchPropertyTypes) {
  return propertyTypes.reduce((columns, typeData) => {
    if (!typeData.enabled) return columns

    const { renderContent, sort } = getRenderer(typeData.type)
    return [
      ...columns,
      {
        name: typeData.name,
        getProps: event => ({
          value: JSON.parse(event.getContent())[typeData.name],
        }),
        renderContent,
        sort,
        header: EventPropertyHeader({ typeData, dispatchPropertyTypes }),
      },
    ]
  }, [])
}

function buildEventsColumns(
  eventsColumnDefs,
  propertyTypes,
  dispatchPropertyTypes
) {
  console.log({
    eventsColumnDefs,
    propertyTypes,
    dispatchPropertyTypes,
  })

  const lastColumn = eventsColumnDefs.length - 1

  const newColumnDefs = [
    ...eventsColumnDefs.slice(0, lastColumn),
    ..._getColumns(propertyTypes, dispatchPropertyTypes),
    eventsColumnDefs[lastColumn],
  ]

  return newColumnDefs
}

export default buildEventsColumns
