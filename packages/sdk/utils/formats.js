function padZero(num) {
  return num.toLocaleString(undefined, { minimumIntegerDigits: 2 })
}

function pluralize(num, str, irregularPlural = '') {
  if (num === 1) return str
  return irregularPlural || `${str}s`
}

function formatNumber(num, units, sigFigures = 3) {
  const [unit, divider, irregularPlural] =
    units.find(([_, divider]) => num >= divider) || units[units.length - 1]

  const value = num / divider
  const formattedValue = sigFigures ? value.toPrecision(sigFigures) : value

  return [formattedValue, unit, divider, irregularPlural]
}

function _formatNumberRecursion(num, units, maxRecursions) {
  maxRecursions--

  // e.g. 100.6 seconds, 2 maxRecursions ==> "1 minute 41 seconds"; "2 minutes" with 1
  const rounding = maxRecursions ? 'floor' : 'round'

  const [unitsFloat, unit, perUnit, irregularPlural] = formatNumber(
    num,
    units,
    null
  )

  const unitsInt = Math[rounding](unitsFloat)
  const segment = `${unitsInt} ${pluralize(unitsInt, unit, irregularPlural)}`

  if (!maxRecursions) return segment

  const remainder = num - unitsInt * perUnit
  const nextSegment = _formatNumberRecursion(remainder, units, maxRecursions)
  const nextSegmentNum = Number(nextSegment.match(/^[\d|.]*/)[0])
  return nextSegmentNum ? `${segment}, ${nextSegment}` : segment
}

function formatDuration(ms, maxRecursions = 2) {
  const units = [
    ['day', 86400000],
    ['hour', 3600000],
    ['minute', 60000],
    ['second', 1000],
    ['ms', 1, 'ms'],
  ]

  return _formatNumberRecursion(ms, units, maxRecursions)
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

export {
  formatDataSize,
  formatNumber,
  formatTime,
  formatDuration,
  padZero,
  pluralize,
}
