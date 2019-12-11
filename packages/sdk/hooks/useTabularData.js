import React, { useContext, useMemo, useState } from 'react'
import T from 'prop-types'

import useSorter from '../hooks/useSorter'
import useFilter from '../hooks/useFilter'
import { TimeContext } from '../components/context/DataProvider'

function mapSorterToColumn(colName, columnDefs) {
  const sortColumnIndex = columnDefs.findIndex(col => col.name === colName)
  return row => row[sortColumnIndex].value
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

function applyCalculations(columns, rawContentProps, metadata) {
  return columns.map((column, columnIndex) => {
    if (!column.calculate) return column
    const columnProps = rawContentProps.map(row => row[columnIndex])

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

  const columnsWithDefaults = applyColumnDefaults(columns)

  const rawContentProps = useMemo(() => {
    return getContentProps(data, columnsWithDefaults, timepoint, metadata)
  }, [data, columnsWithDefaults, timepoint])

  const columnDefs = applyCalculations(
    columnsWithDefaults,
    rawContentProps,
    metadata
  )

  const { sorter, sortDirection, setSortDirection } = useSorter(
    getInitialSortDef(sortColumn, columnDefs)
  )

  const { applyFilters, dispatchFilters } = useFilter([])

  // Give each filterable column functions to update its column's filter values
  columnDefs.forEach(col => {
    if (!col.filter || !!col.filter.updateValues) return

    col.filter.updateValues = values =>
      dispatchFilters({
        action: 'update',
        name: col.filter.name,
        values,
      })

    col.filter.addFilter = values =>
      dispatchFilters({
        action: 'add',
        name: col.filter.name,
        doFilter: col.filter.doFilter,
        values,
        mapFilter: row =>
          row.find(({ columnName }) => columnName === col.name).value,
      })

    col.filter.removeFilter = () =>
      dispatchFilters({
        action: 'remove',
        name: col.filter.name,
      })
  })

  const contentProps = useMemo(() => {
    const filteredContentProps = rawContentProps.filter(applyFilters)
    filteredContentProps.sort(sorter)
    return filteredContentProps
  }, [rawContentProps, sorter, applyFilters])

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
