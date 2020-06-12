import React, { useEffect } from 'react'
import T from 'prop-types'
import { BrowserRouter } from 'react-router-dom'

import ContextWrappers from './components/ContextWrappers'
import Router from './Router'

function Catalogue({ widgets, content, title, theme }) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ContextWrappers theme={theme}>
        <Router content={content} widgets={widgets} title={title} />
      </ContextWrappers>
    </BrowserRouter>
  )
}
Catalogue.propTypes = {
  widgets: T.array.isRequired,
  content: T.array,
  title: T.string,
  theme: T.object,
}

export default Catalogue
