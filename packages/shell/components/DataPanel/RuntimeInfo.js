import React, { useContext } from 'react'
import styled, { css } from 'styled-components'

import {
  formatDuration,
  RuntimeContext,
  ConfigContext,
  WebsocketContext,
} from '@nearform/observer-sdk'

import EditConfig from './EditConfig'

function getStateInterval(config, missingConfig) {
  if (!config) return { stateIntervalText: missingConfig }
  const stateIntervalMs = config.getStateSnapshotIntervalMs()
  const stateIntervalText = formatDuration(stateIntervalMs)
  return {
    stateIntervalMs,
    stateIntervalText,
  }
}

function getRetentionPeriod(config, missingConfig) {
  if (!config) return missingConfig
  const retentionMs = config.getRetentionPeriodMs()
  const retentionText = formatDuration(retentionMs)
  return {
    retentionMs,
    retentionText,
  }
}

const Container = styled.div`
  min-width: 280px;
`

const InfoTable = styled.table`
  border-top: 1px solid ${({ theme }) => theme.color('background', 2)};
  width: 100%;
  color: ${({ theme }) => theme.color('text', 1)};
  ${({ theme }) => theme.text('body', 'small')}
`

const infoCellCss = css`
  padding: ${({ theme }) => theme.spacing()};
  border-bottom: 1px solid ${({ theme }) => theme.color('background', 2)};
`

const InfoCell = styled.td`
  ${infoCellCss}
`
const InfoHead = styled.th`
  font-weight: 600;
  ${infoCellCss}
`

function RuntimeInfo() {
  const runtime = useContext(RuntimeContext)
  const config = useContext(ConfigContext)
  const wsData = useContext(WebsocketContext)

  const missingRuntime = 'No Runtime message available'
  const missingConfig = 'No Configuration message available'

  const { stateIntervalMs, stateIntervalText } = getStateInterval(
    config,
    missingConfig
  )
  const { retentionMs, retentionText } = getRetentionPeriod(
    config,
    missingConfig
  )

  const implementation = runtime ? runtime.getImplementation() : missingRuntime
  const version = runtime ? runtime.getVersion() : missingRuntime
  const platform = runtime ? runtime.getPlatform() : missingRuntime

  return (
    <Container>
      <InfoTable>
        <tbody>
          <tr>
            <InfoHead>Implementation:</InfoHead>
            <InfoCell>{implementation}</InfoCell>
          </tr>
          <tr>
            <InfoHead>Version:</InfoHead>
            <InfoCell>{version}</InfoCell>
          </tr>
          <tr>
            <InfoHead>Platform:</InfoHead>
            <InfoCell>{platform}</InfoCell>
          </tr>
          <tr>
            <InfoHead>State messages every:</InfoHead>
            <InfoCell>
              {wsData && config ? (
                <EditConfig
                  configValue={stateIntervalMs}
                  handleSend={inputMs =>
                    wsData.sendCommand('config', {
                      config: {
                        stateSnapshotIntervalMs: inputMs,
                      },
                    })
                  }
                >
                  {stateIntervalText}
                </EditConfig>
              ) : (
                stateIntervalText
              )}
            </InfoCell>
          </tr>
          <tr>
            <InfoHead>Discard data after:</InfoHead>
            <InfoCell>
              {wsData && config ? (
                <EditConfig
                  configValue={retentionMs}
                  handleSend={inputMs =>
                    wsData.sendCommand('config', {
                      config: {
                        retentionPeriodMs: inputMs,
                      },
                    })
                  }
                >
                  {retentionText}
                </EditConfig>
              ) : (
                retentionText
              )}
            </InfoCell>
          </tr>
        </tbody>
      </InfoTable>
    </Container>
  )
}

export default RuntimeInfo
