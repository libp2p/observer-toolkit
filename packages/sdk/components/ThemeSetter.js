import React, { useContext } from 'react'
import T from 'prop-types'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

import fontFaces from '../theme/fontFaces'
import theme from '../theme/theme.js'

function ThemeSetter({ children }) {
  // Ensure we don't add global styles twice
  if (useContext(ThemeProvider)) {
    throw new Error(
      'ThemeWrapper cannot be nested inside another ThemeProvider or itself'
    )
  }

  const GlobalFontFaceStyles = createGlobalStyle`
    ${fontFaces.join('')}
  `

  const GlobalDefaults = createGlobalStyle`
    * {
      box-sizing: border-box;
      ${({ theme }) => theme.text()};
      color: ${({ theme }) => theme.color('text', 'mid')};
    }
  `

  return (
    <ThemeProvider theme={theme}>
      <GlobalFontFaceStyles />
      <GlobalDefaults />
      {children}
    </ThemeProvider>
  )
}

ThemeSetter.propTypes = {
  children: T.node,
}

export default ThemeSetter
