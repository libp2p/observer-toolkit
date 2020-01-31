import React, { useContext, useMemo, useState } from 'react'
import T from 'prop-types'

import useSorter from '../hooks/useSorter'
import { FilterContext } from '../components/context/FilterProvider'
import { TimeContext } from '../components/context/DataProvider'

function mapSorterToColumn(colName, columnDefs) {
  const sortColumnIndex = columnDefs.findIndex(col => col.name === colName)
  return row => {
    const cell = row[sortColumnIndex]
    return cell.sortValue !== undefined ? cell.sortValue : cell.value
  }
}

function getContentProps(data, columnDefs, timepoint, metadata) {
  return data.map((datum, rowIndex) =>
    columnDefs.map((columnDef, columnIndex) => ({
      ...columnDef.getProps(datum, timepoint, metadata),
      rowIndex,
      columnIndex,
      columnName: columnDef.name,
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

function applyCalculations(columns, contentProps, metadata) {
  return columns.map((column, columnIndex) => {
    if (!column.calculate) return column
    const columnProps = contentProps.map(row => row[columnIndex])

    const calculated = Object.entries(column.calculate).reduce(
      (calculated, [key, doCalc]) => {
        calculated[key] = doCalc(columnProps, metadata)
        return calculated
      },
      {}
    )

    return Object.assign({}, column, calculated)
  })
}

function DefaultRenderer({ value }) {
  return <>{value}</>
}
DefaultRenderer.propTypes = {
  value: T.any,
}

function getInitialSortDef(sortColumn, columnDefs) {
  const sortDef =
    sortColumn && columnDefs.find(col => col.name === sortColumn).sort
  if (!sortDef) return { disabled: true }

  return {
    ...sortDef,
    mapSorter: mapSorterToColumn(sortColumn, columnDefs),
  }
}

function useTabularData({
  columns,
  data,
  defaultSort,
  defaultFilter,
  metadata = {},
}) {
  const [sortColumn, setSortColumn] = useState(defaultSort)
  const timepoint = useContext(TimeContext)
  const { applyFilters } = useContext(FilterContext)

  const columnsWithDefaults = applyColumnDefaults(columns)

  const contentProps = useMemo(() => {
    return getContentProps(
      data.filter(applyFilters),
      columnsWithDefaults,
      timepoint,
      metadata
    )
  }, [data, columnsWithDefaults, timepoint, metadata, applyFilters])

  const columnDefs = applyCalculations(
    columnsWithDefaults,
    contentProps,
    metadata
  )

  const { sorter, sortDirection, setSortDirection } = useSorter(
    getInitialSortDef(sortColumn, columnDefs)
  )

  contentProps.sort(sorter)

  return {
    columnDefs,
    contentProps,
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
      }),
      filter: T.shape({
        doFilter: T.func.isRequired,
        initialValues: T.any,
        filterUi: T.node,
        updateValues: T.func,
      }),
    })
  ).isRequired,
  data: T.arrayOf(T.object).isRequired,
  defaultSort: T.string,
  defaultFilter: T.obj,
  metadata: T.obj,
}

export default useTabularData
