'use strict'

// This will change
const GITHUB_REPO_URL = 'https://github.com/nearform/libp2p-observation-deck'

const chalk = require('chalk')

function successMessage({ name, component }) {
  console.log(`

    ${chalk.black.bgGreen.bold(` Widget "${name}" created! `)}

  `)

  // Some create-* scripts do `git commit` etc for the user. That's way too presumptive,
  // but some users might expect it, so, we make it clear we don't do that.
  console.log(
    chalk.cyan(`If you use ${chalk.bold(
      'git'
    )} or a similar version control system,
we recommend committing these changes now.`)
  )

  // Some create-* scripts run npm i, yarn install etc for you. We don't want to
  // presume users' workflows, so, we make it clear we don't do that.
  console.log(
    chalk.green(`
${chalk.black.bgGreen.bold(' IMPORTANT: ')} Install dependencies your usual way:
  e.g. ${chalk.white.bold('npm i')} or ${chalk.white.bold('yarn install')}`)
  )

  console.log(
    chalk.green(`
Then begin developing your widget in:
  ${chalk.white('./' + component)}

Use Storybook to try your widget on sample data as you go:
  ${chalk.white('npm run storybook')}

See how to deploy it and share it with the libp2p community:
  ${chalk.white(GITHUB_REPO_URL)}
`)
  )
}

module.exports = successMessage
