const palette = {
  primary: {
    // yellow / orange
    light: '191, 222, 0',
    mid: '226, 205, 3',
    dark: '240, 145, 20',
  },
  secondary: {
    // turqouise / teal
    light: '60, 105, 283',
    mid: '2, 131, 166',
    dark: '0, 85, 99',
  },
  tertiary: {
    // purple
    light: '179, 65, 157',
    mid: '154, 125, 151',
    dark: '90, 10, 98',
  },
  notice: {
    // red / magenta
    light: '232, 32, 142',
    mid: '252, 3, 97',
    dark: '166, 2, 69',
  },
  light: {
    // white / cream
    light: '252, 255, 253',
    mid: '235, 243, 243',
    dark: '201, 209, 209',
  },
  dark: {
    // dark navy / violet
    light: '66, 63, 85',
    mid: '33, 30, 57',
    dark: '21, 18, 46',
  },
  text: {
    // black / dark grey
    light: '78, 78, 78',
    mid: '33, 33, 33',
    dark: '0, 0, 0',
  },
}

const color = (col, lightness, alpha) => {
  // For example, `theme.color('secondary', 'dark', 0.5)`
  const rgb = palette[col][lightness]
  return alpha ? `rgba(${rgb}, ${alpha})` : `rgb(${rgb})`
}

const spacing = (num = 1) => `${num * 8}px`

// TODO: fonts need hosting
const typography = {
  default: `
    font-family: nexa, sans-serif;
    line-height: 1.6em;
  `,
  body: {
    small: `
      font-size: 9pt;
    `,
    medium: `
      font-size: 12pt;
    `,
    large: `
      font-size: 16pt;
    `,
  },
  label: {
    small: `
      font-size: 8pt;
      line-height: 1em;
    `,
    medium: `
      font-size: 10pt;
      line-height: 1em;
    `,
    large: `
      font-size: 12pt;
      line-height: 1em;
    `,
  },
  heading: {
    small: `
      font-size: 12pt;
      margin: ${spacing()} 0;
      font-weight: bold;
    `,
    medium: `
      font-size: 16pt;
      margin: ${spacing(2)} 0 ${spacing()};
    `,
    large: `
      font-size: 24pt;
      margin: ${spacing(2)} 0 ${spacing()};
      font-weight: bold;
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

const tableCell = `
  ${text('label', 'medium')}
  padding-top: ${spacing()};
  padding-bottom: ${spacing()};
  padding-left: ${spacing(3)};
  padding-right: ${spacing(2)};
  text-align: right;
`

export default { color, spacing, text, styles: { tableCell } }
