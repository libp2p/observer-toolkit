import React from 'react'
import ReactDOM from 'react-dom'
import Catalogue, { serviceWorker } from '@libp2p/observer-catalogue'

import widgets from './widgets.js'

import about from './about.md'
import contribute from './contribute.md'

const content = [
  { title: 'About', content: about },
  { title: 'Contribute', content: contribute },
  { title: 'GitHub', url: 'https://github.com/libp2p/observer-toolkit' },
  {
    title: 'Documentation',
    url: 'https://github.com/libp2p/observer-toolkit#libp2p-observer',
  },
]

const title = 'Observer Demo App'

ReactDOM.render(
  <Catalogue widgets={widgets} content={content} title={title} />,
  document.getElementById('root')
)

// CRA serviceWorker may be registered to improve performance and
// allow some offline usage. See https://bit.ly/CRA-PWA
serviceWorker.unregister()
