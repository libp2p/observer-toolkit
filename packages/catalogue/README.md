# `catalogue` @libp2p/observer-catalogue

This package exports components allowing the deployment of a browsable catalogue of libp2p Introspection Widgets

<!-- MarkdownTOC -->

- [Exported API](#exported-api)
  - [`Catalogue({ widgets*, Content, title })` **default export**](#catalogue-widgets-content-title--default-export)
  - [`serviceWorker`](#serviceworker)

<!-- /MarkdownTOC -->

<a id="exported-api"></a>
## Exported API

<a id="catalogue-widgets-content-title--default-export"></a>
#### `Catalogue({ widgets*, Content, title })` **default export**
 - `widgets` (required): Array of imported widgets
 - `Content` (optional): React element to override the default introductory homepage text
 - `title` (optional): String to override the default HTML page title
 - `theme` (optional): Object to replace the [default SDK theme](../sdk/theme/theme.js)

Example:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import Catalogue from '@libp2p/observer-catalogue'
import * as connectionsTable from '@nearform/observer-connections-table'
import * as eventsTable from '@nearform/observer-events-table'

const widgets = [connectionsTable, eventsTable]
ReactDOM.render(
  <Catalogue widgets={widgets} />,
  document.getElementById('root')
)
```

<a id="serviceworker"></a>
#### `serviceWorker`

A Create React App service worker which may improve performance for some catalogue builds. See https://create-react-app.dev/docs/making-a-progressive-web-app/ for details and guidance. 
