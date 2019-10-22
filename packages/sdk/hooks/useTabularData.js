import React, { useContext, useMemo, useState } from 'react'
import T from 'prop-types'

import useSorter from '../hooks/useSorter'
import { TimeContext } from '../components/DataProvider'

function mapSorterToColumn(colName, columnDefs) {
  const sortColumnIndex = columnDefs.findIndex(col => col.name === colName)
  return row => row[sortColumnIndex].value
}

function getTableContentProps(data, columnDefs, timepoint) {
  return data.map((datum, rowIndex) =>
    columnDefs.map((columnDef, columnIndex) => ({
      ...columnDef.getProps(datum, timepoint),
      rowIndex,
      columnIndex,
    }))
  )
}

function applyColumnDefaults(columns) {
  return columns.map(column =>
    Object.assign(
      {},
      {
        header: column.name,
        getProps: datum => ({ value: datum[column.name] }),
        renderContent: DefaultRenderer,
      },
      column
    )
  )
}

function DefaultRenderer({ value }) {
  return <>{value}</>
}

DefaultRenderer.propTypes = {
  value: T.any,
}

function useTabularData({ columns, data, defaultSort, defaultFilter }) {
  const [sortColumn, setSortColumn] = useState(defaultSort)
  const timepoint = useContext(TimeContext)

  const columnDefs = applyColumnDefaults(columns)
  const sortDef =
    defaultSort && columnDefs.find(col => col.name === defaultSort).sort

  const { sorter, sortDirection, setSortDirection } = useSorter(
    sortDef
      ? {
          ...sortDef,
          mapSorter: mapSorterToColumn(sortColumn, columnDefs),
        }
      : { disabled: true }
  )

  const processedProps = useMemo(() => {
    const tableContentProps = getTableContentProps(data, columnDefs, timepoint)
    // TODO: filter here
    return [...tableContentProps].sort(sorter)
  }, [data, columnDefs, timepoint, sorter])

  return {
    columnDefs,
    tableContentProps: processedProps,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
  }
}

useTabularData.propTypes = {
  columns: T.arrayOf(
    T.shape({
      name: T.string.required,
      header: T.node,
      getProps: T.func,
      renderContent: T.elementType,
      sort: T.shape({
        sorter: T.func,
        defaultDirection: T.string,
        directionOptions: T.instanceOf(Map),
        preset: T.string,
      }),
      filter: T.obj,
    })
  ).isRequired,
  data: T.arrayOf(T.object).isRequired,
  defaultSort: T.string,
  defaultFilter: T.obj,
}

export default useTabularData
