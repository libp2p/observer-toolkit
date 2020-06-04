'use strict'

const {
  proto: { CommandResponse },
} = require('@nearform/observer-proto')

function _getResult(error) {
  if (error) return CommandResponse.Result.ERR
  return CommandResponse.Result.OK
}

function createCommandResponse({
  commandId,
  effectiveConfig,
  error,
  result = _getResult(error),
}) {
  const response = new CommandResponse()
  response.setResult(result)
  response.setError(error)
  response.setEffectiveConfig(effectiveConfig)
  response.setId(commandId)
  return response
}

module.exports = {
  createCommandResponse,
}
