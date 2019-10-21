function numericSorter(direction, colIndex, key) {
  const sorter = (a, b) => {
    return direction === 'asc' ? a - b : b - a
  }
  return applySorterToColumn(colIndex, sorter, key)
}

function stringSorter(direction, colIndex, key) {
  const sorter = (a, b) => {
    if (a === b) return 0
    const sortNum = a.toLowerCase() > b.toLowerCase() ? 1 : -1
    return direction === 'asc' ? sortNum : sortNum * -1
  }
  return applySorterToColumn(colIndex, sorter, key)
}

// TODO: add simple custom sort API layer around applySorterToColumn and
// move this to ConnectionsTable component package as an example of its usage
function statusSorter(direction, colIndex, key) {
  const statusOrder = ['ACTIVE', 'OPENING', 'CLOSING', 'CLOSED', 'ERROR']
  const sorter = (a, b) => {
    if (a === b) return 0
    const sortNum = statusOrder.indexOf(a) > statusOrder.indexOf(b) ? 1 : -1
    return direction === 'asc' ? sortNum : sortNum * -1
  }
  return applySorterToColumn(colIndex, sorter, key)
}

function applySorterToColumn(colIndex, sorter, key = 'content') {
  return function(aRow, bRow) {
    return sorter(aRow[colIndex][key], bRow[colIndex][key])
  }
}

export { numericSorter, stringSorter, statusSorter }
