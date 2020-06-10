import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import T from 'prop-types'
import {
  useHistory,
  useLocation,
  useRouteMatch,
  matchPath,
} from 'react-router-dom'

import {
  DataContext,
  RuntimeContext,
  SourceContext,
  SetterContext,
} from '@nearform/observer-sdk'

import { Connected, Home } from './pages'

function testHasData(states, runtime, source) {
  return !!runtime || states.length >= 1
}

function getRouteUri(hasData, source, selectedWidget) {
  let route = '/'
  if (!hasData) return route
  route += `${source.type}/${source.name}/`
  if (!selectedWidget) return route
  route += selectedWidget.name
  return route
}

const matchOptions = {
  path: '/:sourceType?/:sourceName?/:widgetName?',
}

function Router({ widgets, Content, title }) {
  const states = useContext(DataContext)
  const runtime = useContext(RuntimeContext)
  const source = useContext(SourceContext)
  const { removeData } = useContext(SetterContext)
  const [hasData, setHasData] = useState(() => testHasData(states, runtime))
  const [widgetIndex, setWidgetIndex] = useState(null)
  const selectedWidget = widgets[widgetIndex]
  const widgetName = selectedWidget ? selectedWidget.name : null

  const willApplyUrlRef = useRef(true)

  const routeUri = getRouteUri(hasData, source, selectedWidget)
  const routeMatch = useRouteMatch(matchOptions)

  const history = useHistory()
  const location = useLocation()
  const fromLink = location.state ? location.state.fromLink : false

  const sourceType = source.type

  const updateUrlFromState = useCallback(() => {
    history.push(routeUri)
  }, [history, routeUri])

  const updateStateFromParams = useCallback(
    params => {
      if (params.widgetName !== widgetName) {
        if (!params.widgetName) {
          setWidgetIndex(null)
        } else {
          const newWidgetIndex = widgets.findIndex(
            widget => widget.name === params.widgetName
          )
          setWidgetIndex(newWidgetIndex)
        }
      }
      if (params.sourceType !== sourceType) {
        if (!params.sourceType && sourceType) {
          const okay = confirm(
            'Return to home page? This will unload all current data.'
          )
          if (okay) {
            removeData()
          } else {
            updateUrlFromState()
          }
        }
      }
    },
    [widgetName, sourceType, widgets, removeData, updateUrlFromState]
  )

  const handlePopState = useCallback(() => {
    willApplyUrlRef.current = true
  }, [willApplyUrlRef])

  const currentPathname = location.pathname
  const currentlyHasData = testHasData(states, runtime)

  useEffect(() => {
    if (fromLink || willApplyUrlRef.current) {
      updateStateFromParams(routeMatch.params)
      willApplyUrlRef.current = false
      if (fromLink) {
        // Reset location state
        history.replace({ ...location, state: {} })
      }
    } else {
      if (currentPathname !== routeUri) {
        history.push(routeUri)
      }
    }

    if (!hasData && currentlyHasData) {
      setHasData(true)
      return
    }
    if (hasData && !currentlyHasData && !source.name) {
      setHasData(false)
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [
    hasData,
    currentlyHasData,
    source,
    history,
    location,
    routeUri,
    routeMatch,
    currentPathname,
    handlePopState,
    updateStateFromParams,
    fromLink,
  ])

  const initialSourceType = routeMatch.params.sourceType

  return hasData ? (
    <Connected
      widgets={widgets}
      setWidgetIndex={setWidgetIndex}
      widgetIndex={widgetIndex}
    />
  ) : (
    <Home Content={Content} initialSourceType={initialSourceType} />
  )
}
Router.propTypes = {
  widgets: T.array.isRequired,
  Content: T.elementType,
  title: T.string,
}

export default Router
