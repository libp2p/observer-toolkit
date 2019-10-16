const { readFileSync, writeFileSync } = require('fs')
const path = '../introspection_pb.js'
writeFileSync(
  path,
  `
  /* eslint-disable */
  ${readFileSync(path)}
`
)
