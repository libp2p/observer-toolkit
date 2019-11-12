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
    copyFile('../../../.gitignore', {
      // Temporarily drop the `.` to dodge NPM's .gitignore >> .npmignore
      // rename bugfeature explained here https://github.com/npm/npm/issues/7252
      outputFilename: 'gitignore',
      ...copyProps,
    }),

    copyFile('../../../package.json', copyProps),
    copyFile('../../sdk/package.json', {
      outputDirname: './root-repo/sdk',
    }),
    copyFile('../../proto/package.json', {
      outputDirname: './root-repo/proto',
    }),
  ]

  await Promise.all(copyPromises)
  console.log(
    chalk.green(
      `Copied ${copyPromises.length} files to @libp2p-observer/create-widget`
    )
  )
}

prepublish()
