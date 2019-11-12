'use strict'

const chalk = require('chalk')
const camelCase = require('lodash.camelcase')
const fs = require('fs')
const kebabCase = require('lodash.kebabcase')
const path = require('path')
const readline = require('readline-promise').default
const upperFirst = require('lodash.upperfirst')

const copyFile = require('./copy-file')
const getPackageJsonContent = require('./get-package-json-content')
const successMessage = require('./success-message')

const { readFile, writeFile } = fs.promises

const rlp = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function initWidget() {
  const packageJsonPath = path.resolve('./package.json')
  const existingPackageJson = fs.existsSync(packageJsonPath)
    ? JSON.parse(await readFile(packageJsonPath))
    : {}

  const nameDefault = existingPackageJson.name
    ? ` (${existingPackageJson.name})`
    : ''
  const nameQuestion =
    chalk.cyan('Name of widget: ') + chalk.grey(nameDefault + '\n')
  let widgetName = await rlp.questionAsync(nameQuestion)
  if (!widgetName) {
    if (!existingPackageJson.name) {
      console.error(chalk.red('Name of widget is required'))
      initializeWidget()
      return
    }
    console.log(existingPackageJson.name + '\n')
    widgetName = existingPackageJson.name
  }

  const widgetNameCamel = upperFirst(camelCase(widgetName)) // ComponentNameStyle
  const widgetNameKebab = kebabCase(widgetName) // skewered-with-hyphens

  const descDefault = existingPackageJson.description
    ? ` (${existingPackageJson.description})`
    : ''
  const descQuestion =
    chalk.cyan('Short description of widget (optional): ') +
    chalk.grey(descDefault + '\n')
  let widgetDesc = await rlp.questionAsync(descQuestion)
  if (!widgetDesc) {
    console.log(existingPackageJson.description + '\n')
    widgetDesc = existingPackageJson.description || ''
  }

  const authorDefault = existingPackageJson.author
    ? ` (${existingPackageJson.author})`
    : ''
  const authorQuestion =
    chalk.cyan('Author (optional, like "name <email@example.com>"): ') +
    chalk.grey(authorDefault + '\n')
  let widgetAuthor = await rlp.questionAsync(authorQuestion)
  if (!widgetAuthor) {
    console.log(existingPackageJson.author + '\n')
    widgetAuthor = existingPackageJson.author || ''
  }

  const replaceText = {
    name: widgetNameKebab,
    component: widgetNameCamel,
    description: widgetDesc,
    author: widgetAuthor,
  }

  await Promise.all([
    copyFile('./index.js', replaceText),
    copyFile('./description.md', replaceText),
    copyFile('./README.md', replaceText),

    copyFile(
      './components/MainComponent.js',
      replaceText,
      `${widgetNameCamel}.js`
    ),
    copyFile(
      './components/MainComponent.stories.js',
      replaceText,
      `${widgetNameCamel}.stories.js`
    ),

    copyFile('./.storybook/config.js'),
    copyFile('./.storybook/webpack.config.js'),

    // Copy config from this repo where possible to avoid duplication
    copyFile('../../../.eslintrc'),
    copyFile('../../../.eslintignore'),
    copyFile('../../../.prettierignore'),
    copyFile('../../../.prettierrc'),
    copyFile('../../../babel.config.js'),
    // TODO: Check this avoids NPM's .gitignore ↳ .npmignore rename bugfeature
    copyFile('../../../.gitignore'),
  ])

  const packageJsonContent = await getPackageJsonContent(
    existingPackageJson,
    replaceText
  )
  if (packageJsonContent !== existingPackageJson) {
    try {
      await writeFile(packageJsonPath, packageJsonContent)
    } catch (err) {
      console.error(
        chalk.red(`Could not write to package.json, error ${err.code}`)
      )
      throw err
    }
  }

  successMessage(replaceText)
}

module.exports = initWidget
