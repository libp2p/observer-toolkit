'use strict'

const { fork } = require('child_process')
const { promisify } = require('util')
const path = require('path')
const fs = require('fs').promises

const rimraf = require('rimraf')
const rimrafPromise = promisify(rimraf)

const noop = () => {}

const testDirPath = path.join(__dirname, './testModuleDir')

async function setup() {
  try {
    const exists = await fs.stat(testDirPath)
    if (exists) {
      await cleanupWidget()
    }
  } catch (e) {
    noop(e)
  } finally {
    await fs.mkdir(testDirPath)
  }
}

async function cleanupWidget() {
  await rimrafPromise(testDirPath)
}

// Runs the create-widget script and gives example answers to CLI questions
async function createTestWidget() {
  await setup()

  const childOptions = {
    cwd: testDirPath,
    silent: true,
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  }
  const child = fork(path.join(__dirname, '../..'), [], childOptions)
  child.stderr.on('data', data => console.error('stderr: ', data.toString()))

  const nameMatcher = /name of widget/i
  const descMatcher = /description/i
  const authorMatcher = /author/i
  const successMatcher = /widget "test.widget" created/i

  const cliMatchers = [nameMatcher, descMatcher, authorMatcher, successMatcher]

  const makeResponder = promisify((matcher, response, callback) => {
    const responder = function(data) {
      const logMessage = data.toString()
      if (logMessage.match(matcher)) {
        if (response) {
          child.stdin.write(`${response}\n`)
        }

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
    makeResponder(successMatcher, null),
  ])

  child.kill(1)
}

module.exports = {
  createTestWidget,
  cleanupWidget,
  testDirPath,
}
