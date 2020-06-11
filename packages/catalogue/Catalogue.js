import React, { useEffect } from 'react'
import T from 'prop-types'
import { BrowserRouter } from 'react-router-dom'

import ContextWrappers from './components/ContextWrappers'
import Router from './Router'

function Catalogue({ widgets, content, title, theme, basename }) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])

  return (
    <ContextWrappers theme={theme}>
      <BrowserRouter basename={basename}>
        <Router content={content} widgets={widgets} title={title} />
      </BrowserRouter>
    </ContextWrappers>
  )
}
Catalogue.propTypes = {
  widgets: T.array.isRequired,
  content: T.array,
  title: T.string,
  theme: T.object,
}

export default Catalogue
