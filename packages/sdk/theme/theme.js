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
    '163, 170, 18',
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
  return alpha ? `rgba(${rgb}, ${alpha})` : `rgb(${rgb})`
}

const spacing = (num = 1) => `${num * 8}px`

const typography = {
  default: `
    font-family: plex-sans, sans-serif;
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
