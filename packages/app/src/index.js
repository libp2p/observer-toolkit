import React from 'react'
import ReactDOM from 'react-dom'
import Catalogue, { serviceWorker } from '@nearform/observer-catalogue'

import widgets from './widgets.js'

import about from './about.md'
import contribute from './contribute.md'

const content = [
  { title: 'About', content: about },
  { title: 'Contribute', content: contribute },
  { title: 'GitHub', url: 'https://github.com/nearform/libp2p-observer' },
  {
    title: 'Documentation',
    url: 'https://github.com/nearform/libp2p-observer#libp2p-observer',
  },
]

const title = 'Observer Demo App'
const basename = '/libp2p-observer'

ReactDOM.render(
  <Catalogue
    widgets={widgets}
    content={content}
    title={title}
    basename={basename}
  />,
  document.getElementById('root')
)

// CRA serviceWorker may be registered to improve performance and
// allow some offline usage. See https://bit.ly/CRA-PWA
serviceWorker.unregister()
