'use strict'

// These packages in our repo export JSX and we must tell webpack to use babel loader on them
const jsxPackages = [
  'app',
  'catalogue',
  'connections-table',
  'dht-buckets',
  'events-table',
  'sdk',
  'shell',
  'streams-table',
  'testing',
]

// Regex for all other packages
const nonJsxPackagesRegex = new RegExp(
  `node_modules[\\\\/](?!@libp2p[\\\\/]observer-(${jsxPackages.join(
    '|'
  )}))[\\\\/]`
)

module.exports = {
  jsxPackages,
  nonJsxPackagesRegex,
}
