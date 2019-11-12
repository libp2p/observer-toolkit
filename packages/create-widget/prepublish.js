'use strict'

const chalk = require('chalk')

const copyFile = require('./lib/copy-file')

const copyProps = { outputDirname: './root-repo' }

async function prepublish() {
  // Copy config from host root repo where possible to avoid duplication
  const copyPromises = [
    copyFile('../../../.eslintrc', copyProps),
    copyFile('../../../.eslintignore', copyProps),
    copyFile('../../../.prettierignore', copyProps),
    copyFile('../../../.prettierrc', copyProps),
    copyFile('../../../babel.config.js', copyProps),
    // TODO: Check this avoids NPM's .gitignore ↳ .npmignore rename bugfeature
    copyFile('../../../.gitignore', copyProps),
  ]

  await Promise.all(copyPromises)
  console.log(
    chalk.green(
      `Copied ${copyPromises.length} files to @libp2p-observer/create-widget`
    )
  )
}

prepublish()
