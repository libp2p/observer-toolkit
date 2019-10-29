const defaultDirection = 'asc'

const directionOptions = [['asc', 'Open first'], ['desc', 'Closed first']]

const openFirstOrder = ['ACTIVE', 'OPENING', 'CLOSING', 'CLOSED', 'ERROR']
const closedFirstOrder = ['CLOSED', 'CLOSING', 'ERROR', 'ACTIVE', 'OPENING']

function getSorter(direction) {
  const statusSorter = (a, b) => {
    if (a === b) return 0
    const statusOrder = direction === 'asc' ? openFirstOrder : closedFirstOrder
    const sortNum = statusOrder.indexOf(a) > statusOrder.indexOf(b) ? 1 : -1
    return sortNum
  }
  return statusSorter
}

export { defaultDirection, directionOptions, getSorter }
