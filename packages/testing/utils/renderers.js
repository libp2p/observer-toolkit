import { render /*, queries */ } from '@testing-library/react'

import {
  DataTestWrapper,
  ShellTestWrapper,
  ThemeTestWrapper,
} from '../components'

const defaultOptions = {
  // TODO: Add custom queries here as needed
  // queries: { ...queries, ...customQueries }
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

export { renderWithData, renderWithShell, renderWithTheme }
