'use strict'

const fs = require('fs')
const { readFile } = fs.promises
const path = require('path')
const chalk = require('chalk')

const {
  dependenciesList,
  devDependenciesList,
  peerDependenciesList,
} = require('../template/dependencies')
const getDepVersion = require('./get-dep-version')

function extractDeps(depList, depType, packageJson) {
  return depList.reduce((newDeps, depName) => {
    return {
      ...newDeps,
      [depName]: getDepVersion(depName, depType, packageJson),
    }
  }, {})
}

async function getPackageJsonContent(
  existingPackageJson,
  { name, description, author }
) {
  const corePackageJsonPath = path.resolve(
    __dirname,
    '../root-repo',
    'package.json'
  )

  const corePackageJson = JSON.parse(await readFile(corePackageJsonPath))

  const coreScriptsToCopy = ['lint', 'lint-fix', 'prettier', 'prettier-fix']

  const scripts = coreScriptsToCopy.reduce(
    (scripts, scriptName) => {
      const scriptDef = corePackageJson.scripts[scriptName]
      if (!scriptDef) {
        throw new Error(
          chalk.red(
            `Script "${scriptName}" not found in root-repo package.json`
          )
        )
      }
      return {
        [scriptName]: scriptDef,
        ...scripts,
      }
    },
    {
      storybook: 'start-storybook -p 9009',
      test: 'jest',
    }
  )

  const dependencies = extractDeps(
    dependenciesList,
    'dependencies',
    corePackageJson
  )
  const devDependencies = extractDeps(
    devDependenciesList,
    'devDependencies',
    corePackageJson
  )
  const peerDependencies = extractDeps(
    peerDependenciesList,
    'peerDependencies',
    corePackageJson
  )

  const newPackageJsonObj = Object.assign({}, existingPackageJson, {
    name,
    description,
    author,
    main: 'index.js',
    scripts,
    dependencies,
    devDependencies,
    peerDependencies,
  })

  return JSON.stringify(newPackageJsonObj, null, 2)
}

module.exports = getPackageJsonContent
