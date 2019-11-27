function getNumericSorter(direction) {
  const numericSorter = (a, b) => (direction === 'asc' ? a - b : b - a)
  return numericSorter
}

export default getNumericSorter
