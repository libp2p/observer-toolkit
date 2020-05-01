import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon, StyledButton, Tooltip } from '@libp2p-observer/sdk'

import StreamsSubtable from './StreamsSubtable'

const Container = styled.span`
  text-align: right;
  white-space: nowrap;
`

const StreamsNumber = styled.span`
  margin-right: ${({ theme }) => theme.spacing(2)};
  min-width: ${({ theme }) => theme.spacing(4)};
  display: inline-block;
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
  ${({ theme }) => theme.transition()}
  [data-tooltip="open"] > & {
    background: ${({ theme }) => theme.color('background', 1)};
  }
`

function ConnectionStreamsContent({
  value,
  streamsCount = value,
  connection,
  hidePrevious,
}) {
  const streamsButtonText = streamsCount ? `View streams` : 'No streams'

  return (
    <Container>
      <StreamsNumber>{streamsCount}</StreamsNumber>
      <Tooltip
        side="bottom"
        fixOn="no-hover"
        toleranceY={null}
        toleranceX={-32}
        hidePrevious={hidePrevious}
        content={<StreamsSubtable connection={connection} />}
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
