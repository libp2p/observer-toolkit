'use strict'

const { test } = require('tap')

const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')
const rimraf = require('rimraf')
const { promisify } = require('util')

const rimrafPromise = promisify(rimraf)
const execPromise = promisify(exec)

async function cleanup() {
  const dir = path.resolve(__dirname, './root-repo/**')
  await rimrafPromise(dir)
}

test('Prepare script', async t => {
  if (fs.existsSync('./root-repo')) {
    await cleanup()
  }
  t.notOk(fs.existsSync('./root-repo'))

  await execPromise('npm run prepublishOnly')

  // Check it is created - check contents via next test
  t.ok(fs.existsSync('./root-repo'))
  t.end()
})

// TODO: test generate script contents

test('Postpublish script', async t => {
  t.ok(fs.existsSync('./root-repo'))

  await execPromise('npm run postpublish')

  const exists = fs.existsSync('./root-repo')
  // Check it is created - check contents via next test
  t.notOk(exists)

  if (exists) {
    await cleanup()
  }
  t.end()
})
