'use strict'

const chalk = require('chalk')
const path = require('path')

const copyFile = require('./lib/copy-file')

const outputDirname = path.resolve(__dirname, './root-repo')
const copyProps = { outputDirname }

// Don't fail silently
process.on('unhandledRejection', err => {
  throw err
})

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
      outputDirname: path.resolve(outputDirname, 'sdk'),
    }),
    copyFile('../../proto/package.json', {
      outputDirname: path.resolve(outputDirname, 'proto'),
    }),
  ]

  await Promise.all(copyPromises)
  console.log(
    chalk.green(`Copied ${copyPromises.length} files to ${outputDirname}`)
  )
}

prepublish()
