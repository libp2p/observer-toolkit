function getStringSorter(direction = 'asc') {
  const caselessSorter = Intl.Collator('en').compare
  const stringSorter = (a, b) => {
    const sortNum = caselessSorter(a, b)
    return direction === 'asc' ? sortNum : sortNum * -1
  }
  return stringSorter
}

export default getStringSorter
