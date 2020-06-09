'use strict'

const {
  proto: { CommandResponse },
} = require('@nearform/observer-proto')

function _getResult(error) {
  if (error) return CommandResponse.Result.ERR
  return CommandResponse.Result.OK
}

function createCommandResponse({
  id,
  effectiveConfig,
  error,
  result = _getResult(error),
}) {
  if (id === undefined)
    throw new Error('CommandResponse needs an ID matching command ID')

  const response = new CommandResponse()
  response.setResult(result)
  response.setError(error)
  response.setEffectiveConfig(effectiveConfig)
  response.setId(id)
  return response
}

module.exports = {
  createCommandResponse,
}
