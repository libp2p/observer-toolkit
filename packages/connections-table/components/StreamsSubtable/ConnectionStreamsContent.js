import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon, StyledButton, Tooltip } from '@nearform/observer-sdk'

import StreamsSubtable from './StreamsSubtable'

const Container = styled.div`
  text-align: right;
  white-space: nowrap;
`

const ExpandIcon = styled.span`
  transform: rotate(90deg);
  margin-right: ${({ theme }) => theme.spacing(-1)};
  [data-tooltip='open'] > button > & {
    transform: rotate(180deg);
  }
  ${({ theme }) => theme.transition({ property: 'transform' })}
`

const ExpandButton = styled(StyledButton)`
  position: relative;
  right: ${({ theme }) => theme.spacing(-1)};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: ${({ theme }) => theme.spacing(17)};
  ${({ theme }) => theme.transition()}
  [data-tooltip="open"] > & {
    background: ${({ theme }) => theme.color('background', 1)};
  }
`

const TooltipTarget = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

function ConnectionStreamsContent({
  value,
  streamsCount = value,
  connection,
  hidePrevious,
}) {
  const streamsButtonText = streamsCount
    ? `View ${streamsCount} streams`
    : 'No streams'

  return (
    <Container>
      <Tooltip
        side="bottom"
        fixOn="no-hover"
        toleranceY={null}
        toleranceX={-32}
        hidePrevious={hidePrevious}
        content={<StreamsSubtable connection={connection} />}
        override={{ Target: TooltipTarget }}
      >
        <ExpandButton disabled={!streamsCount}>
          {streamsButtonText}
          {streamsCount && (
            <Icon type="expand" override={{ Container: ExpandIcon }} />
          )}
        </ExpandButton>
      </Tooltip>
    </Container>
  )
}

ConnectionStreamsContent.propTypes = {
  value: T.number,
  connection: T.object.isRequired,
  streamsCount: T.number,
  hidePrevious: T.func,
}

export default ConnectionStreamsContent
