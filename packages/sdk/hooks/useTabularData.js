import React, { useContext, useMemo, useState } from 'react'
import T from 'prop-types'

import useSorter from '../hooks/useSorter'
import { FilterContext } from '../components/context/FilterProvider'

function mapSorterToColumn(colName, columnDefs) {
  const sortColumnIndex = columnDefs.findIndex(col => col.name === colName)
  return row => {
    const cell = row[sortColumnIndex]
    return cell.sortValue !== undefined ? cell.sortValue : cell.value
  }
}

function getContentProps(data, columnDefs, metadata, getRowKey) {
  return data.map((datum, rowIndex) => {
    const rowContent = columnDefs.map((columnDef, columnIndex) => ({
      ...columnDef.getProps(datum, metadata),
      rowIndex,
      columnIndex,
      columnName: columnDef.name,
    }))

    rowContent.key = getRowKey(rowContent, rowIndex)
    return rowContent
  })
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

function getInitialSortDef(sortColumn, columnDefs, defaultSort) {
  const sortColumnDef =
    sortColumn && columnDefs.find(col => col.name === sortColumn)

  if (!sortColumnDef) return getInitialSortDef(defaultSort, columnDefs)

  const sortDef = sortColumnDef.sort
  if (!sortDef) return { disabled: true }

  return {
    ...sortDef,
    mapSorter: mapSorterToColumn(sortColumn, columnDefs),
  }
}

function useTabularData(props) {
  T.checkPropTypes(useTabularData.propTypes, props, 'prop', 'useTabularData')
  const { columns, data, defaultSort, defaultRange, metadata = {} } = props

  const [sortColumn, setSortColumn] = useState(defaultSort)
  const [range, setRange] = useState(defaultRange)
  const { applyFilters } = useContext(FilterContext)

  const columnsWithDefaults = applyColumnDefaults(columns)

  const allContent = useMemo(() => {
    // Key rows by a unique identifying property if one is declared in column def
    const keyColumnIndex = columnsWithDefaults.findIndex(
      colDef => !!colDef.rowKey
    )
    const keyColumn = keyColumnIndex >= 0 && columnsWithDefaults[keyColumnIndex]
    const getRowKey = (rowContent, rowIndex) =>
      keyColumn ? rowContent[keyColumnIndex][keyColumn.rowKey] : rowIndex

    return getContentProps(
      data.filter(applyFilters),
      columnsWithDefaults,
      metadata,
      getRowKey
    )
  }, [data, columnsWithDefaults, metadata, applyFilters])

  const columnDefs = applyCalculations(
    columnsWithDefaults,
    allContent,
    metadata
  )

  const { sorter, sortDirection, setSortDirection } = useSorter(
    getInitialSortDef(sortColumn, columnDefs, defaultSort)
  )

  allContent.sort(sorter)
  allContent.forEach((item, index) => (item.index = index))

  const shownContent = range ? allContent.slice(range[0], range[1]) : allContent

  const rowCounts = {
    total: allContent.length,
    shown: shownContent.length,
    maxShown: range ? range[1] - range[0] : allContent.length,
    showFrom: range ? range[0] : 0,
  }

  return {
    columnDefs,
    allContent,
    shownContent,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    rowCounts,
    setRange,
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
  defaultRange: T.arrayOf(T.number),
  metadata: T.object,
}

export default useTabularData
