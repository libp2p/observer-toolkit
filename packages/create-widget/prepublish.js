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
  // Track how many files were actually copied
  let successes = 0

  const copyAndCount = async (path, props) => {
    const wasSuccess = await copyFile(path, props)
    if (wasSuccess) successes++
  }
  const copyPackageJsonAndCount = async (pkg, outputDirname) => {
    await copyAndCount(`../../${pkg}/package.json`, {
      outputDirname: path.resolve(outputDirname, pkg),
    })
  }

  // Copy config from host root repo where possible to avoid duplication
  const copyPromises = [
    copyAndCount('../../../.eslintignore', copyProps),
    copyAndCount('../../../.prettierignore', copyProps),
    copyAndCount('../../../.prettierrc', copyProps),
    copyAndCount('../../../babel.config.js', copyProps),
    copyAndCount('../../../jsx-packages.js', copyProps),
    copyAndCount('../../../packages/.eslintrc', {
      outputDirname: path.resolve(copyProps.outputDirname, 'packages'),
    }),
    copyAndCount('../../../.gitignore', {
      // Temporarily drop the `.` to dodge NPM's .gitignore >> .npmignore
      // rename bugfeature explained here https://github.com/npm/npm/issues/7252
      outputFilename: 'gitignore',
      ...copyProps,
    }),

    copyAndCount('../../../package.json', copyProps),
    copyPackageJsonAndCount('sdk', outputDirname),
    copyPackageJsonAndCount('data', outputDirname),
    copyPackageJsonAndCount('shell', outputDirname),
  ]

  await Promise.all(copyPromises)
  console.log(
    chalk.green(
      `Copied ${successes} file${
        successes === 1 ? '' : 's'
      } to ${outputDirname}`
    )
  )
}

prepublish()
