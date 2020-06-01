import React, { useContext } from 'react'
import T from 'prop-types'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { Normalize } from 'styled-normalize'

import fontFaces from '../../theme/fontFaces'
import defaultTheme from '../../theme/theme.js'

function ThemeSetter({ theme = defaultTheme, children }) {
  // Ensure we don't add global styles twice
  if (useContext(ThemeProvider)) {
    throw new Error(
      'ThemeSetter cannot be nested inside another ThemeProvider or itself'
    )
  }

  const GlobalFontFaceStyles = createGlobalStyle`
    ${fontFaces.join('')}
  `

  // TODO: make line height smarter
  const GlobalDefaults = createGlobalStyle`
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'plex-sans, sans-serif';
    }
    p, li, h1, h2, h3, h4, h5, h6 {
      color: ${({ theme }) => theme.color('text', 1)};
    }
    button {
      padding: 0;
      margin : 0;
      border: none;
      background: transparent;
      line-height: inherit;
      color: inherit;
      text-align: inherit;
    }
  `

  return (
    <ThemeProvider theme={theme}>
      <Normalize />
      <GlobalFontFaceStyles />
      <GlobalDefaults />
      {children}
    </ThemeProvider>
  )
}

ThemeSetter.propTypes = {
  children: T.node,
  theme: T.object,
}

export default ThemeSetter
