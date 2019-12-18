const { test } = require('tap')
const path = require('path')
const fs = require('fs').promises
const rimraf = require('rimraf')
const { spawn } = require('child_process')
const split = require('split2')

const wait = t => new Promise(resolve => setTimeout(() => resolve(), t))

async function setup() {
  const pat = path.join(__dirname, './testModuleDir')
  try {
    const exists = await fs.stat(pat)
    if (exists) {
      await new Promise(resolve => rimraf(pat, () => resolve()))
    }
  } catch {
  } finally {
    await fs.mkdir(pat)
  }
}
async function cleanup() {
  const pat = path.join(__dirname, './testModuleDir')
  await new Promise(resolve => rimraf(pat, () => resolve()))
}

test('that it passes', async t => {
  await setup()

  const child = spawn(process.execPath, [path.join(__dirname, '..')], {
    cwd: path.join(__dirname, './testModuleDir'),
    env: process.env,
    stdio: ['pipe', 'pipe', 'pipe'],
    detached: false,
  })

  child.stdin.setEncoding('utf-8')

  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  await wait(1000)
  child.stdin.write('a name\n')
  await wait(3000)
  child.stdin.write('a desc\n')
  await wait(3000)
  child.stdin.write('author <email@example.com>\n')
  await wait(3000)

  child.kill(1)

  await cleanup()
  t.end()
})
