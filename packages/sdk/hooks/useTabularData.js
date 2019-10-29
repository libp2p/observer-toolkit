import React, { useContext, useMemo, useState } from 'react'
import T from 'prop-types'

import useSorter from '../hooks/useSorter'
import useFilter from '../hooks/useFilter'
import { TimeContext } from '../components/context/DataProvider'

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

function getInitialFilters(columnDefs) {
  const initialFilters = columnDefs.reduce((initialFilters, col) => {
    if (!col.filter) return initialFilters
    const { name, doFilter, initialValues } = col.filter
    initialFilters.push({
      name,
      doFilter,
      values: initialValues,
      mapFilter: row =>
        row.find(({ columnName }) => columnName === col.name).value,
    })
    return initialFilters
  }, [])

  return initialFilters
}

function useTabularData({ columns, data, defaultSort, defaultFilter }) {
  const [sortColumn, setSortColumn] = useState(defaultSort)
  const timepoint = useContext(TimeContext)

  const columnDefs = applyColumnDefaults(columns)

  const { sorter, sortDirection, setSortDirection } = useSorter(
    getInitialSortDef(sortColumn, columnDefs)
  )

  const { applyFilters, dispatchFilters } = useFilter(
    getInitialFilters(columnDefs)
  )

  // Give each filterable column a function to update its column's filter values
  columnDefs.forEach(col => {
    if (!col.filter || !!col.filter.updateValues) return
    col.filter.updateValues = newValues =>
      dispatchFilters({
        action: 'update',
        name: col.filter.name,
        values: newValues,
      })
  })

  const tableContentProps = useMemo(() => {
    const rawContentProps = getTableContentProps(data, columnDefs, timepoint)
    const filteredContentProps = rawContentProps.filter(applyFilters)

    filteredContentProps.sort(sorter)
    return filteredContentProps
  }, [data, columnDefs, timepoint, sorter, applyFilters])

  return {
    columnDefs,
    tableContentProps,
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
}

export default useTabularData
