'use strict'

const { random } = require('../utils')

// Creates enums where some items may be more frequent than others,
// based on having a higher probability of being randomly chosen
class EnumWithFrequency {
  constructor(items) {
    // Expects array of arrays: [ num, item, frequency ]
    this.items = items
    this.byNum = items.reduce((obj, [num, item]) => {
      obj[num] = item
      return obj
    }, {})
  }
  getItem(num) {
    /* istanbul ignore if */
    if (!Object.prototype.hasOwnProperty.call(this.byNum, num)) {
      throw this.targetNotValid(num, 0)
    }

    return this.byNum[num]
  }
  getNum(target) {
    // eslint bug https://github.com/eslint/eslint/issues/12165
    // eslint-disable-next-line no-unused-vars
    for (const [num, item] of this.items) {
      if (target === item) return num
    }

    /* istanbul ignore next */
    throw this.targetNotValid(target)
  }
  getRandom(index = 0, filterTo) {
    // Picks a random entry where higher frequency => more likely to be picked
    const rand = random()
    const items = filterTo
      ? this.items.filter(item => filterTo.includes(item[index]))
      : this.items

    const totalFreq = items.reduce((acc, [, , freq]) => acc + freq, 0)
    let culmFreq = 0

    // eslint bug https://github.com/eslint/eslint/issues/12165
    // eslint-disable-next-line no-unused-vars
    for (const item of items) {
      const freq = item[2]
      culmFreq += freq
      if (rand <= culmFreq / totalFreq) return item[index]
    }

    /* istanbul ignore next */
    throw new Error(
      `This should be unreachable - culmFreq=${culmFreq}, rand=${rand}`
    )
  }
  /* istanbul ignore next */
  targetNotValid(target, validKey = 1) {
    // Throw an informative error if a script tries to choose an item that doesn't exist
    const validItems = this.items.map(item => item[validKey])
    return new Error(
      `"${target}" not valid, expected one of: "${validItems.join('", "')}"`
    )
  }
}

module.exports = EnumWithFrequency
