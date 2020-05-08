import React, { useContext } from 'react'
import styled, { css } from 'styled-components'

import { formatDuration, RuntimeContext } from '@libp2p/observer-sdk'

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

  const stateInterval = formatDuration(runtime.getSendStateIntervalMs())

  const dataExpiry = formatDuration(runtime.getKeepStaleDataMs())

  return (
    <Container>
      <InfoTable>
        <tbody>
          <tr>
            <InfoHead>Implementation:</InfoHead>
            <InfoCell>{runtime.getImplementation()}</InfoCell>
          </tr>
          <tr>
            <InfoHead>Version:</InfoHead>
            <InfoCell>{runtime.getVersion()}</InfoCell>
          </tr>
          <tr>
            <InfoHead>Platform:</InfoHead>
            <InfoCell>{runtime.getPlatform()}</InfoCell>
          </tr>
          <tr>
            <InfoHead>State messages every:</InfoHead>
            <InfoCell>{stateInterval}</InfoCell>
          </tr>
          <tr>
            <InfoHead>Discard data after:</InfoHead>
            <InfoCell>{dataExpiry}</InfoCell>
          </tr>
        </tbody>
      </InfoTable>
    </Container>
  )
}

export default RuntimeInfo
