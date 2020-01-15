'use strict'

const { test } = require('tap')

const { fork } = require('child_process')
const { promisify } = require('util')
const path = require('path')
const fs = require('fs').promises

const { createInterface } = require('readline')

const rimraf = require('rimraf')
const rimrafPromise = promisify(rimraf)

const wait = promisify(setTimeout)
const noop = () => {}

process.on('unhandledRejection', err => {
  throw err
})

const testDirPath = path.join(__dirname, './testModuleDir')

async function setup() {
  try {
    const exists = await fs.stat(testDirPath)
    if (exists) {
      await rimrafPromise(testDirPath)
    }
  } catch (e) {
    noop(e)
  } finally {
    await fs.mkdir(testDirPath)
  }
}
async function cleanup() {
  const testDirPath = path.join(__dirname, './testModuleDir')
  await rimrafPromise(testDirPath)
}

test('that it passes', async t => {
  await setup()

  const childOptions = {
    silent: true,
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  }
  const child = fork(path.join(__dirname, '..'), [], childOptions)

  child.stderr.on('data', data => console.log('stderr: ', data.toString()))
  child.stdin.on('data', data => console.log('in: ', data.toString()))
  child.stdout.on('data', data => console.log('out: ', data.toString()))

  const widgetName = 'Test Widget'

  const nameMatcher = /name/i
  const descMatcher = /description/i
  const authorMatcher = /author/i
  const successMatcher = new Regexp(`Widget "${widgetName}" created!`, 'i')

  const cliMatchers = [nameMatcher, descMatcher, authorMatcher, successMatcher]

  const makeResponder = promisify((matcher, response, callback) => {
    const responder = function(data) {
      const logMessage = data.toString()
      if (logMessage.match(matcher)) {
        child.stdin.write(`${response}\n`)

        child.stdout.removeListener('data', this)
        callback()
      } else if (!cliMatchers.some(rx => logMessage.match(rx))) {
        // Fail meaningfully (not by tap timeout) if a message matches nothing
        const rxList = cliMatchers.map(rx => rx.toString()).join(', ')
        callback(
          new Error(
            `CLI message "${logMessage}" does not match any of ${rxList}`
          )
        )
      }
    }

    child.stdout.on('data', data => responder.call(responder, data))
  })

  await Promise.all([
    makeResponder(nameMatcher, 'Test Widget'),
    makeResponder(descMatcher, 'Test description'),
    makeResponder(authorMatcher, 'Test Name <email@example.com>'),
  ])

  child.kill(1)
  await cleanup()
  t.end()
})
