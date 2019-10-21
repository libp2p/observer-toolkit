'use strict'

const { readFileSync, writeFileSync } = require('fs')
const path = './protobuf/introspection_pb.js'
writeFileSync(
  path,
  `
  /* eslint-disable */
  ${readFileSync(path)}
`
)
