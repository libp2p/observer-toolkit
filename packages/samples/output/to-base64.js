'use strict'

const { argv } = require('yargs').options({
  f: {
    alias: 'file',
    describe: 'path to binary protobuf data file to convert',
    type: 'string',
  },
  o: {
    alias: 'output',
    describe:
      'path to write base64 output. If ommitted, appends ".base64" to input path',
    type: 'string',
  },
})

const { readFileSync, createWriteStream } = require('fs')

const { file: filePath, output: outputArg } = argv

const fileContent = readFileSync(filePath)
const base64 = Buffer.from(fileContent).toString('base64')

const outputPath = outputArg || filePath + '.base64'

createWriteStream(outputPath).write(base64)
