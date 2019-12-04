#!/usr/bin/env node
'use strict'

const initWidget = require('./lib/init-widget')

// Don't fail silently
process.on('unhandledRejection', err => {
  throw err
})

initWidget()
