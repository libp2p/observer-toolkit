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

  const widgetName = await askQuestion(
    existingPackageJson,
    'name',
    'Name of widget'
  )
  if (widgetName === false) {
    console.error(chalk.red('Name of widget is required'))
    initWidget()
    return
  }
  const widgetDesc = await askQuestion(
    existingPackageJson,
    'description',
    'Short description of widget (optional)'
  )
  const widgetAuthor = await askQuestion(
    existingPackageJson,
    'author',
    'Author, e.g. "name <email@example.com>" (optional)'
  )

  const widgetNameCamel = upperFirst(camelCase(widgetName)) // ComponentNameStyle
  const widgetNameKebab = kebabCase(widgetName) // skewered-with-hyphens

  const replaceText = {
    name: widgetNameKebab,
    component: widgetNameCamel,
    description: widgetDesc,
    author: widgetAuthor,
  }

  await Promise.all([
    copyFile('./index.js', { replaceText }),
    copyFile('./description.md', { replaceText }),
    copyFile('./README.md', { replaceText }),

    copyFile('./components/MainComponent.js', {
      replaceText,
      outputFilename: `${widgetNameCamel}.js`,
    }),
    copyFile('./components/MainComponent.stories.js', {
      replaceText,
      outputFilename: `${widgetNameCamel}.stories.js`,
    }),

    copyFile('./.storybook/config.js'),
    copyFile('./.storybook/webpack.config.js'),

    // Copy config from this repo where possible to avoid duplication
    copyFile('../root-repo/.eslintrc', { outputDirname: '.' }),
    copyFile('../root-repo/.eslintignore', { outputDirname: '.' }),
    copyFile('../root-repo/.prettierignore', { outputDirname: '.' }),
    copyFile('../root-repo/.prettierrc', { outputDirname: '.' }),
    copyFile('../root-repo/babel.config.js', { outputDirname: '.' }),
    // TODO: Check this avoids NPM's .gitignore ↳ .npmignore rename bugfeature
    copyFile('../root-repo/gitignore', {
      outputDirname: '.',
      outputFilename: '.gitignore',
    }),
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

async function askQuestion(existingPackageJson, key, questionText) {
  const defaultAnswer = existingPackageJson[key]
    ? ` (${existingPackageJson[key]})`
    : ''
  const questionTextFormatted =
    chalk.cyan(`${questionText}: `) + chalk.grey(`${defaultAnswer}\n`)

  let answer = await rlp.questionAsync(questionTextFormatted)
  if (!answer) {
    if (!existingPackageJson[key]) return false

    console.log(existingPackageJson[key] + '\n')
    answer = existingPackageJson[key]
  }

  return answer
}

module.exports = initWidget
