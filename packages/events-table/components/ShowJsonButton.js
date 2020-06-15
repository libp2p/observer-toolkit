import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Icon, StyledButton, Tooltip } from '@libp2p/observer-sdk'

import RawJsonExpanded from './RawJsonExpanded'

const ExpandIcon = styled.span`
  transform: rotate(90deg);
  margin-right: ${({ theme }) => theme.spacing(-1)};
  [data-tooltip='open'] > button > & {
    transform: rotate(180deg);
  }
  ${({ theme }) => theme.transition({ property: 'transform' })}
`

const ExpandButton = styled(StyledButton)`
  cursor: pointer;
  ${({ theme }) => theme.transition()}
  [data-tooltip="open"] > & {
    background: ${({ theme }) => theme.color('background', 1)};
  }
`

function ShowJsonButton({ value = '', hidePrevious }) {
  if (!value) return ''
  return (
    <Tooltip
      side="bottom"
      fixOn="no-hover"
      toleranceY={null}
      toleranceX={-32}
      hidePrevious={hidePrevious}
      content={<RawJsonExpanded value={value} />}
    >
      <ExpandButton>
        Show JSON
        <Icon type="expand" override={{ Container: ExpandIcon }} />
      </ExpandButton>
    </Tooltip>
  )
}
ShowJsonButton.propTypes = {
  value: T.string,
  hidePrevious: T.func,
}

export default ShowJsonButton
