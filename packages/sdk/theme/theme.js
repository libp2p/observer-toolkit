const palette = {
  background: [
    // white / pale beige / pale grey
    '255, 255, 255',
    '241, 242, 240',
    '220, 228, 234',
  ],
  contrast: [
    // near-black / dark purple / purple
    '20, 22, 45',
    '78, 23, 91',
    '121, 27, 137',
  ],
  text: [
    // black / grey / white
    '0, 0, 0',
    '93, 94, 96',
    '128, 130, 133',
    '255, 255, 255',
  ],
  primary: [
    // yellow / orange
    '252, 189, 32',
    '232, 137, 0',
  ],
  secondary: [
    // cyan / blue
    '112, 208, 224',
    '32, 155, 198',
  ],
  tertiary: [
    // green
    '196, 209, 18',
    '159, 176, 0',
    '0, 99, 109',
  ],
  highlight: [
    // magenta / crimson
    '209, 14, 102',
    '163, 26, 75',
  ],
}

const color = (col, val = 0, alpha) => {
  // For example, `theme.color('secondary', 1, 0.5)` for translucent blue
  const rgb = palette[col][val]
  return typeof alpha === 'number' ? `rgba(${rgb}, ${alpha})` : `rgb(${rgb})`
}

const spacingPx = 8
const spacing = (value = 1, returnNum = false) => {
  if (Array.isArray(value)) {
    const values = value.map(num => spacing(num, returnNum))
    return returnNum ? values : values.join(' ')
  }

  const size = value * spacingPx
  return returnNum ? size : `${size}px`
}

const typography = {
  default: `
    font-family: plex-sans, sans-serif;
    line-height: 1.6em;
  `,
  body: {
    small: `
      font-size: 9pt;
      line-height: 1.6em;
    `,
    medium: `
      font-size: 10pt;
      line-height: 1.6em;
    `,
    large: `
      font-size: 11pt;
      line-height: 1.6em;
    `,
  },
  label: {
    small: `
      font-size: 8pt;
      line-height: 1.2em;
    `,
    medium: `
      font-size: 9pt;
      line-height: 1.2em;
    `,
    large: `
      font-size: 10pt;
      line-height: 1.2em;
    `,
  },
  heading: {
    small: `
      font-size: 9pt;
      margin: 0;
      font-weight: 700;
      line-height: 1.2em;
    `,
    medium: `
      font-size: 12pt;
      margin: ${spacing([0.5, 0])};
      font-weight: 600;
      line-height: 1.2em;
    `,
    large: `
      font-size: 16pt;
      margin: ${spacing([0.5, 0])};
      font-weight: 500;
      line-height: 1.2em;
    `,
    extraLarge: `
      font-size: 24pt;
      margin: ${spacing([2, 0, 1])};
      font-weight: 600;
      line-height: 1.2em;
    `,
  },
}

const text = (elem, size, rgb) => {
  // TODO: see if styled-components has a convenient way to merge overrides
  // css`` doesn't work here: adds commas breaking CSS rules
  return `
    ${typography.default}
    ${elem && size ? typography[elem][size] : ''}
    ${rgb ? `color: ${rgb};` : ''}
  `
}

const boxShadow = ({
  size = 1,
  colorKey = 'contrast',
  colorIndex = 0,
  opacity = 0.2,
} = {}) => {
  const shadowColor = color(colorKey, colorIndex, opacity)
  return `box-shadow: 0 ${spacing(0.25 * size)} ${spacing(
    size
  )} ${shadowColor};`
}

function transition(values = {}) {
  if (Array.isArray(values)) {
    return `transition:${values.map(_getTransitionEntry).join(', ')};`
  }
  return `transition:${_getTransitionEntry(values)};`
}

function _getTransitionEntry({
  property = 'all',
  duration = 0.4,
  timingFunction = 'ease-in-out',
  delay = '',
}) {
  return ` ${property} ${duration}s ${timingFunction}${
    delay ? ` ${delay}s  ` : ''
  }`
}

const tableCell = `
  ${text('label', 'medium')}
  padding-top: ${spacing()};
  padding-bottom: ${spacing()};
  padding-left: ${spacing(3)};
  padding-right: ${spacing(2)};
  text-align: left;
`

export default {
  color,
  spacing,
  text,
  boxShadow,
  transition,
  styles: { tableCell },
}
