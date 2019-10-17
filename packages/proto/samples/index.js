const fs = require('fs')
const samples = []

fs.readdirSync(__dirname, filename => samples.push(fs.readFileSync(filename)))

module.exports = samples
