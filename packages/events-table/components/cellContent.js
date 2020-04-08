import React from 'react'
import T from 'prop-types'
import styled from 'styled-components'

import { Tooltip } from '@libp2p-observer/sdk'

// import parseJsonString from '../utils/parseJsonString'
import { RenderTime, RenderJson } from './contentRenderers'

const JsonTruncator = styled.div`
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  position: relative;
  text-overflow: ellipsis;
`

function EventPropertyHeader({ typeData, dispatchPropertyTypes }) {
  const handleRemove = e => {
    e.stopPropagation()
    dispatchPropertyTypes({
      action: 'disable',
      data: typeData,
    })
  }
  return (
    <Tooltip
      fixOn="never"
      content={<button onClick={handleRemove}>Remove</button>}
    >
      {typeData.name}
    </Tooltip>
  )
}
EventPropertyHeader.propTypes = {
  typeData: T.object.isRequired,
  dispatchPropertyTypes: T.func.isRequired,
}

function TimeContent({ value }) {
  return <RenderTime content={value} />
}
TimeContent.propTypes = {
  value: T.string,
}

function RawJsonTruncated({ value = '' }) {
  return (
    <Tooltip
      side="bottom"
      toleranceY={null}
      content={<RawJsonExpanded value={value} />}
    >
      <JsonTruncator>
        <RenderJson value={value} />
      </JsonTruncator>
    </Tooltip>
  )
}
RawJsonTruncated.propTypes = {
  value: T.string,
}

function RawJsonExpanded({ value = '' }) {
  return (
    <div>
      <RenderJson value={value} />
      JSON tree here...
    </div>
  )
}
RawJsonExpanded.propTypes = {
  value: T.string,
}

export { EventPropertyHeader, TimeContent, RawJsonTruncated }
