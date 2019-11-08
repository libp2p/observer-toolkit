'use strict'

const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const { mkdir, readFile, rename, writeFile } = fs.promises

async function copyFile(
  filePath,
  replaceText,
  outputFilename = path.basename(filePath)
) {
  const inputPath = path.resolve(__dirname, '../template', filePath)
  const outputPath = path.resolve(
    '.',
    path.dirname(filePath.replace(/(\.\.\/)+/, './')),
    outputFilename
  )

  const inputText = await readFile(inputPath, 'utf8')
  const outputText = !replaceText
    ? inputText
    : inputText
        .replace(/\$WIDGET_NAME/g, replaceText.name)
        .replace(/\$WIDGET_DESCRIPTION/g, replaceText.description)
        .replace(/\$WIDGET_AUTHOR/g, replaceText.author)

  if (fs.existsSync(outputPath)) {
    let message = `Found existing file "${filePath}":
    `

    try {
      const existingText = await readFile(outputPath, 'utf8')
      if (existingText === outputText) {
        message += chalk.green(` ↳ Files are identical. File not changed.`)
        console.log(message)
        return
      } else {
        const newPath = `${outputPath}.copy`
        await rename(outputPath, newPath)
        message += chalk.blue(` ↳ Renamed original as "${filePath}.copy"`)
        console.log(message)
      }
    } catch (err) {
      message += chalk.red(
        ` ↳ Cannot access existing file (${err.code}). File not copied.`
      )
      console.warn(message)
      return
    }
  }

  try {
    await writeFile(outputPath, outputText)
  } catch (err) {
    if (err.code !== 'EEXIST' && err.code !== 'ENOENT') {
      console.error(`Error ${err.code} writing to ${outputPath}`)
    }

    const outputDir = path.dirname(outputPath)
    await mkdir(outputDir, { recursive: true })
    await writeFile(outputPath, outputText)
  }
}

module.exports = copyFile
