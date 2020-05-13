'use strict'

const chalk = require('chalk')
const path = require('path')
const { readFileSync } = require('fs')

function getDepVersion(depName, depType, corePackageJson) {
  // Mismatching versions can cause of bugs; automatically keep versions matching
  // Where possible, use the version used by the monorepo
  let version = corePackageJson[depType] && corePackageJson[depType][depName]
  if (!version) {
    // For sibling packages, use the latest version
    const siblingMatch = depName.match(/^@nearform\/observer-(.+)/)
    const isSiblingPackage = !!siblingMatch

    // For other dependencies, use the version used by the SDK
    const targetDir = siblingMatch ? siblingMatch[1] : 'sdk'

    const targetPackageJsonPath = path.resolve(
      __dirname,
      '../root-repo',
      targetDir,
      'package.json'
    )

    const targetPackageJson = JSON.parse(readFileSync(targetPackageJsonPath))

    version = isSiblingPackage
      ? `^${targetPackageJson.version}`
      : targetPackageJson[depType[depName]]
  }

  if (!version)
    console.warn(
      chalk.yellow(
        `No version number found for ${depName} in ${depType}. Falling back to "*"`
      )
    )
  return version || '*'
}

module.exports = getDepVersion
