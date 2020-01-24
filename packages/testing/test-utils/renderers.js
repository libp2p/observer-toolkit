import { render, queries, getQueriesForElement } from '@testing-library/react'

import DataTestWrapper from '../components/DataTestWrapper'
import ShellTestWrapper from '../components/ShellTestWrapper'
import ThemeTestWrapper from '../components/ThemeTestWrapper'

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
    wrapper: ThemeTestWrapper,
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

// `within` within a custom render doesn't inherit custom queries
function within(element) {
  return getQueriesForElement(element, allQueries)
}

export { renderWithData, renderWithShell, renderWithTheme, within }
