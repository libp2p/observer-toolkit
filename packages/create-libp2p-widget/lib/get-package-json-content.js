'use strict'

const fs = require('fs')
const { readFile } = fs.promises

const {
  dependenciesList,
  devDependenciesList,
} = require('../template/dependencies')
const getDepVersion = require('./get-dep-version')

async function getPackageJsonContent(
  existingPackageJson,
  { name, description, author }
) {
  const corePackageJsonPath = '../../package.json'
  const corePackageJson = JSON.parse(await readFile(corePackageJsonPath))

  const dependencies = dependenciesList.reduce((newDeps, depName) => {
    return {
      ...newDeps,
      [depName]: getDepVersion(depName, 'dependencies', corePackageJson),
    }
  }, {})

  const devDependencies = devDependenciesList.reduce((newDeps, depName) => {
    return {
      ...newDeps,
      [depName]: getDepVersion(depName, 'devDependencies', corePackageJson),
    }
  }, {})

  const newPackageJsonObj = Object.assign({}, existingPackageJson, {
    name,
    description,
    author,
    main: 'index.js',
    dependencies,
    devDependencies,
  })

  return JSON.stringify(newPackageJsonObj, null, 2)
}

module.exports = getPackageJsonContent
