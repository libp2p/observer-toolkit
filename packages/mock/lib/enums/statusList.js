'use strict'

const EnumWithFrequency = require('./EnumWithFrequency')
const { randomFractionOfSecond, randomNormalDistribution } = require('../utils')

const statusList = new EnumWithFrequency([
  [0, 'ACTIVE', 80],
  [1, 'CLOSED', 16],
  [2, 'OPENING', 1],
  [3, 'CLOSING', 1],
  [4, 'ERROR', 2],
])

function mockCloseTimeByStatus(status, open, now) {
  switch (statusList.getItem(status)) {
    case 'ACTIVE':
    case 'OPENING':
    case 'ERROR':
      return null
    case 'CLOSING':
      return Math.round(now + randomFractionOfSecond() - 500)
    case 'CLOSED':
      return Math.round(
        randomNormalDistribution({
          min: open,
          max: now,
          skew: 1,
        })
      )
  }
}

function mockOpenTimeByStatus(status, secondsOpen, now) {
  switch (statusList.getItem(status)) {
    case 'OPENING':
    case 'ERROR':
      return null
    case 'ACTIVE':
    case 'CLOSING':
    case 'CLOSED':
      return Math.round(
        randomNormalDistribution({
          min: now - secondsOpen * 1000,
          max: now,
          skew: 1,
        })
      )
  }
}

function randomChildStatus(status) {
  let statusName = statusList.getItem(status)
  switch (statusName) {
    case 'CLOSED':
    case 'ERROR':
    case 'OPENING':
      return status
    case 'CLOSING':
      statusName = statusList.getRandom(1, ['CLOSING', 'CLOSED'])
      break
    case 'ACTIVE':
      statusName = statusList.getRandom(1, ['OPENING', 'ACTIVE'])
      break
  }
  return statusList.getNum(statusName)
}

module.exports = {
  statusList,
  mockCloseTimeByStatus,
  mockOpenTimeByStatus,
  randomChildStatus,
}
