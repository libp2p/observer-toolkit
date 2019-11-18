'use strict'

const { test } = require('tap')

const samples = require('@libp2p-observer/samples')
const { parseImport } = require('../lib/binary')

test('Sample data can be deserialized', t => {
  const dataset = parseImport(samples[0])
  t.type(dataset, Array, 'Sample data deserializes to an array')
  t.ok(dataset.length, 'Deserialized sample data array is not empty')
  t.end()
})
