import React, { useEffect } from 'react'
import T from 'prop-types'

import ContextWrappers from './components/ContextWrappers'
import Router from './Router'

function Catalogue({ widgets, Content, title }) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])

  return (
    <ContextWrappers>
      <Router Content={Content} widgets={widgets} />
    </ContextWrappers>
  )
}
Catalogue.propTypes = {
  widgets: T.array.isRequired,
  Content: T.elementType,
  title: T.string,
}

export default Catalogue
