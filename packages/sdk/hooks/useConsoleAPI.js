import { useContext, useEffect, useState } from 'react'
import T from 'prop-types'
import { ThemeContext } from 'styled-components'

import dataHelpers from '@libp2p/observer-data'

const getH1Style = theme =>
  `color: ${theme.color('secondary')}; font-size: 21px;`
const getBodyStyle = theme =>
  `color: ${theme.color('tertiary', 3)}; font-size: 12px;`

function outputWelcome(theme) {
  console.log(
    `%c
Welcome to the libp2p Observer!
`,
    getH1Style(theme)
  )
  console.log(
    `%c
Here the console, you may explore \`libp2pObs\` on the global scope.
This contains many entries useful for debugging or exploring the libp2p Observer:
  `,
    getBodyStyle(theme)
  )
  console.log(
    `%c
🔢 \`libp2pObs.data\` contains data shared by the DataProvider context, including raw protobuf \`states\`, \`events\` and \`runtime\`.

These are documented at [TODO: add link when docs are complete]
  `,
    getBodyStyle(theme)
  )
  console.log(
    `%c
🛠️ \`libp2pObs.dataHelpers\` contains the helper functions from \`packages/data\`, which can process data in the same way that UI widgets do.

These are documented at [TODO: add link when docs are complete]
  `,
    getBodyStyle(theme)
  )
  console.log(
    `%c
🎨 \`libp2pObs.theme\` contains the \`theme\` object used by the UI in conjunction with \`styled-components\` to style the UI.

This is documented at [TODO: add link when docs are complete]
  `,
    getBodyStyle(theme)
  )
  console.log(
    `%c
📝 \`libp2pObs.logData\` is a helper function that logs stored protobuf messages as JS objects which can be explored more easiy in the console.
  `,
    getBodyStyle(theme)
  )
}

function useConsoleApi(props) {
  T.checkPropTypes(useConsoleApi.propTypes, props, 'prop', 'useConsoleApi')
  const {
    states,
    events,
    runtime,
    config,
    source,
    websocket,
    currentState,
  } = props

  const [isInitialised, setIsInitialised] = useState(false)
  const theme = useContext(ThemeContext)

  if (!isInitialised) {
    const notInTest = typeof jest === 'undefined'
    if (notInTest) outputWelcome(theme)
  }

  useEffect(() => {
    if (!isInitialised) {
      setIsInitialised(true)
    }
  }, [isInitialised, setIsInitialised, theme])

  const data = {
    states,
    events,
    runtime,
    config,
    source,
    websocket,
    currentState,
  }

  const logData = () => {
    console.log({
      states: states.map(state => state.toObject()),
      events: events.map(event => event.toObject()),
      runtime: runtime ? runtime.toObject() : runtime,
    })
  }

  window.libp2pObs = {
    data,
    dataHelpers,
    theme,
    logData,
  }
}
useConsoleApi.propTypes = {
  states: T.array,
  events: T.array,
  runtime: T.object,
  source: T.object,
  websocket: T.object,
  currentState: T.object,
}

export default useConsoleApi
