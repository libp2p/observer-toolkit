const defaultDirection = 'asc'

const directionOptions = [
  ['asc', 'Open first'],
  ['desc', 'Closed first'],
]

const openFirstOrder = ['ACTIVE', 'OPENING', 'CLOSING', 'CLOSED', 'ERROR']
const closedFirstOrder = ['CLOSED', 'CLOSING', 'ERROR', 'ACTIVE', 'OPENING']

function getSorter(direction) {
  const statusSorter = (a, b) => {
    const isAscending = direction === 'asc'
    const statusOrder = isAscending ? openFirstOrder : closedFirstOrder

    const [a_statusName, a_timeOpen, a_timeClosed] = a
    const [b_statusName, b_timeOpen, b_timeClosed] = b

    if (a_statusName !== b_statusName) {
      const a_statusRank = statusOrder.indexOf(a_statusName)
      const b_statusRank = statusOrder.indexOf(b_statusName)
      const sortNum = a_statusRank > b_statusRank ? 1 : -1
      return sortNum
    }

    const isOpen = a_statusName === 'ACTIVE' || a_statusName === 'OPENING'

    // If ascending, show oldest open connections first, oldest closed last
    let sortNum
    if (isOpen) {
      if (a_timeOpen === b_timeOpen) {
        sortNum = 0
      } else {
        sortNum = a_timeOpen < b_timeOpen ? 1 : -1
      }
    } else {
      if (a_timeClosed === b_timeClosed) {
        sortNum = 0
      } else {
        sortNum = a_timeClosed < b_timeClosed ? -1 : 1
      }
    }
    return isAscending ? sortNum : sortNum * -1
  }
  return statusSorter
}

export { defaultDirection, directionOptions, getSorter }
