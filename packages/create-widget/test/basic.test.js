'use strict'

const { test } = require('tap')

const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')
const rimraf = require('rimraf')
const { promisify } = require('util')
const {
  createTestWidget,
  cleanupWidget,
  testDirPath,
} = require('./fixtures/createTestWidget')

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

// Must be run after prepublishOnly, before postpublish
// i.e. on the package as it is when published to registry
test('Create widget', async t => {
  t.notOk(fs.existsSync(testDirPath))

  try {
    await createTestWidget()
  } catch (error) {
    await cleanupWidget()
    throw error
  }

  t.ok(fs.existsSync(testDirPath))
  t.ok(fs.existsSync(path.resolve(testDirPath, 'components', 'TestWidget.js')))

  const packageJson = require(path.resolve(testDirPath, 'package.json'))
  t.equals(packageJson.name, 'test-widget')
  t.equals(packageJson.description, 'Test description')
  t.equals(packageJson.author, 'Test Name <email@example.com>')

  await cleanupWidget()
  t.end()
})

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
