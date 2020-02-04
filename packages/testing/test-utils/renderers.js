import { render, queries, getQueriesForElement } from '@testing-library/react'

import DataTestWrapper from '../components/DataTestWrapper'
import ShellTestWrapper from '../components/ShellTestWrapper'
import ThemeWrapper from '../components/ThemeWrapper'

import * as customQueries from './queries'

const allQueries = { ...queries, ...customQueries }

const defaultOptions = {
  queries: allQueries,
}

function _render(component, options = {}) {
  return render(component, {
    ...defaultOptions,
    ...options,
  })
}

// Least overhead - minimum to render against a styled snapshot
function renderWithTheme(component) {
  return _render(component, {
    wrapper: ThemeWrapper,
  })
}

// Has everything renderWithTheme has plus a sample dataset via DataProvider
function renderWithData(component) {
  return _render(component, {
    wrapper: DataTestWrapper,
  })
}

// Has everything renderWithData has plus shell UI (timeline, data panel...)
function renderWithShell(component) {
  return _render(component, {
    wrapper: ShellTestWrapper,
  })
}

// SDK tests get contexts from relative paths, but the above wrappers will
// get them from the SDK build. Use this, import the wrapper, and pass contexts
// to the wrapper from sdk/test-fixtures/contexts.js
function renderForSDK(component) {
  return _render(component)
}

// `within` within a custom render doesn't inherit custom queries
function within(element) {
  return getQueriesForElement(element, allQueries)
}

export {
  renderWithData,
  renderWithShell,
  renderWithTheme,
  renderForSDK,
  within,
}
