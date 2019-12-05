function formatNumber(num, units, sigFigures = 3) {
  const [unit, divider] =
    units.find(([_, divider]) => num >= divider) || units[units.length - 1]

  const value = num / divider
  const formattedValue = sigFigures ? value.toPrecision(sigFigures) : value

  return [formattedValue, unit]
}

function formatDataSize(num) {
  if (num === 0) return ['0']

  const units = [
    ['pb', 1e15],
    ['tb', 1e12],
    ['gb', 1e9],
    ['mb', 1e6],
    ['kb', 1e3],
    ['bytes', 1],
  ]
  return formatNumber(num, units)
}

function formatTime(timestamp) {
  const time = new Date(timestamp)
  const hr = padZero(time.getHours())
  const min = padZero(time.getMinutes())
  const sec = padZero(time.getSeconds())
  return `${hr}:${min}:${sec}`
}

function padZero(num) {
  return num.toLocaleString(undefined, { minimumIntegerDigits: 2 })
}

export { formatDataSize, formatNumber, formatTime, padZero }
