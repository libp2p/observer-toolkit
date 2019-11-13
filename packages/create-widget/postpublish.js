'use strict'

const chalk = require('chalk')
const path = require('path')
const rimrafCb = require('rimraf')
const { promisify } = require('util')

const rimraf = promisify(rimrafCb)

// Don't fail silently
process.on('unhandledRejection', err => {
  throw err
})

// Files copied to 'root-repo' dir are for published tarball only, not to be committed
async function removeRootRepoCopies() {
  const dirPath = path.resolve(__dirname, './root-repo/**')
  try {
    await rimraf(dirPath)
  } catch (err) {
    if (err.code === 'ENOTEMPTY') {
      console.error(
        chalk.red(
          'Please use Node version 12.10 or greater (rmdir recursive not supported'
        )
      )
    }
    if (err.code === 'EACCES') {
      console.error(chalk.red(`Permission denied to delete ${dirPath}`))
    }

    throw err
  }

  console.log(chalk.green(`Removed packed files from ${dirPath}`))
}

removeRootRepoCopies()
