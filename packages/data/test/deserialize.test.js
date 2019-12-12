'use strict'

const { test } = require('tap')

const { readFileSync } = require('fs')
const path = require('path')
const samplesPath = require.resolve('@libp2p-observer/samples')
const sampleFilePath = path.resolve(
  path.dirname(samplesPath),
  'samples',
  'sample-1min.mock'
)

const { parseImport } = require('../lib/binary')

test('Sample data can be deserialized', t => {
  const { states } = parseImport(readFileSync(sampleFilePath))
  t.type(states, Array, 'Sample data deserializes to an array')
  t.ok(states, 'Deserialized sample data array is not empty')
  t.end()
})
