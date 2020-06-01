function getNumericSorter(direction = 'desc') {
  const numericSorter = (a, b) => (direction === 'asc' ? a - b : b - a)
  return numericSorter
}

export default getNumericSorter
