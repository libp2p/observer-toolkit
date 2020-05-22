import React from 'react'
import ReactDOM from 'react-dom'
import Catalogue, { serviceWorker } from '@nearform/observer-catalogue'

import widgets from './widgets.js'

ReactDOM.render(
  <Catalogue widgets={widgets} />,
  document.getElementById('root')
)

// CRA serviceWorker may be registered to improve performance and
// allow some offline usage. See https://bit.ly/CRA-PWA
serviceWorker.unregister()
