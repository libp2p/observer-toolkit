'use strict'

const fs = require('fs')
const { readFile } = fs.promises
const path = require('path')

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
    dependencies,
    devDependencies,
    peerDependencies,
  })

  return JSON.stringify(newPackageJsonObj, null, 2)
}

module.exports = getPackageJsonContent
