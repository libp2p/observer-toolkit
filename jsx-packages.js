'use strict'

// These packages in our repo export JSX and we must tell webpack to use babel loader on them
const jsxPackages = [
  'catalogue',
  'connections-table',
  'sdk',
  'shell',
  'streams-table',
]

module.exports = jsxPackages
