import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import T from 'prop-types'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import {
  applySampleData,
  DataContext,
  RuntimeContext,
  SourceContext,
  SetterContext,
} from '@nearform/observer-sdk'
import samples from '@nearform/observer-samples'

import { Connected, Home } from './pages'

function testHasData(states, runtime, source) {
  return !!runtime || states.length >= 1
}

function getRouteUri(hasData, source, selectedWidget) {
  let route = '/'
  if (!hasData || !source.type) return route
  route += `${source.type}/${source.name}/`
  if (!selectedWidget) return route
  route += selectedWidget.name
  return route
}

const matchOptions = {
  path: '/:sourceType?/:sourceName?/:widgetName?',
}

function Router({ widgets, content, title }) {
  const states = useContext(DataContext)
  const runtime = useContext(RuntimeContext)
  const source = useContext(SourceContext)
  const { removeData, updateData, setIsLoading } = useContext(SetterContext)
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
        } else if (params.sourceType === 'sample' && params.sourceName) {
          const sample = samples.find(
            sample =>
              sample.file.includes(params.sourceName) ||
              sample.name === params.sourceName
          )
          const sampleFile = sample.file
          const handleUploadStart = () =>
            removeData({
              type: 'sample',
              name: params.sourceName,
              isLoading: true,
            })
          const handleUploadChunk = data => updateData(data)
          const handleUploadFinished = () => setIsLoading(false)

          applySampleData(
            sampleFile,
            handleUploadStart,
            handleUploadFinished,
            handleUploadChunk
          )
        }
      }
    },
    [
      widgetName,
      sourceType,
      widgets,
      removeData,
      updateUrlFromState,
      updateData,
      setIsLoading,
    ]
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
      title={title}
      content={content}
      widgets={widgets}
      setWidgetIndex={setWidgetIndex}
      widgetIndex={widgetIndex}
    />
  ) : (
    <Home
      content={content}
      title={title}
      initialSourceType={initialSourceType}
    />
  )
}
Router.propTypes = {
  widgets: T.array.isRequired,
  content: T.array,
  title: T.string,
}

export default Router
