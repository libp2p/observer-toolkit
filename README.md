# libp2p-observer

A toolkit for building, hosting and deploying widgets that visualise LibP2P Introspection data.

<!-- MarkdownTOC -->

- [Setup](#setup)
  - [Local deployment](#local-deployment)
    - [Sample data](#sample-data)
    - [Upload a file](#upload-a-file)
    - [Live connection](#live-connection)
  - [Getting data](#getting-data)
    - [Mock data](#mock-data)
    - [LibP2P REPL](#libp2p-repl)
- [Packages](#packages)
- [Documentation](#documentation)

<!-- /MarkdownTOC -->


<a id="setup"></a>
## Setup

To get started locally, first, clone the repo, and run `yarn install`. The UI can then be deployed and connected to a data source:

<a id="local-deployment"></a>
### Local deployment

Run `npm run start:app` to run a dev build of the `app` package, containing a catalogue UI for browsing built-in React widgets and connecting these to a data source.

When the UI is loaded, three types of data sources are available:

<a id="sample-data"></a>
#### Sample data

Pre-made data samples are provided to show how the UI works. They can be loaded using the `Sample data` button and selecting one of the datasets.

<a id="upload-a-file"></a>
#### Upload a file

Just like the pre-made samples, it's possible to upload your own dataset. Compatible datasets can be exported using the UI's "Export data" button, and mock data files can be generated using the command `npm run mock-file` with optional flags below.

<a id="live-connection"></a>
#### Live connection

To get live introspection data streaming into the UI, enter the websockets address of a LibP2P introspection server.

For example, if a LibP2P node is running an introspection server under `introspect` on local port 12345, connect to `ws://localhost:12345/introspect`.

<a id="getting-data"></a>
### Getting data

If no active LibP2P introspection server is available, in addition to the built-in data samples there are two easy ways to obtain data:

<a id="mock-data"></a>
#### Mock data

To run generate mock data that simulates a LibP2P network with randomised activity, use one of these two commands, from either the repo root directory or the samples package: 

- `npm run mock-sock` starts a mock data server on port 8080 that can be connected to via a websocket 
- `npm run mock-file` writes a mock data file that can be uploaded

Both [accept several options](packages/samples/readme.md) to define certain aspects of the mock P2P network or output.

<a id="libp2p-repl"></a>
#### LibP2P REPL

The [LibP2P REPL](https://github.com/libp2p/repl) provides a simple way to connect to real LibP2P activity:

 1. Clone https://github.com/libp2p/repl and follow its setup instructions
 2. Find and copy the REPL's listening port by:choosing "My Info" in the REPL CLI then finding the listed "Introspection server Listen Address"
 3. Generate some activity using the REPL CLI. The option "DHT: Bootstrap (public seeds)" generates a lot of connection and DHT activity.
 4. In the catalogue UI, connect to the websocket address copied earlier, appending `/introspect`. For example, if My Info gave a listening address of 127.0.0.1/12345, connect to `ws://127.0.0.1:12345/introspect`

<a id="packages"></a>
## [Packages](packages)

This is a [Lerna monorepo](https://github.com/lerna/lerna), managed with [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

**Each directory in the [`packages`](packages) directory is an independent package**, published to NPM, installable and usable in projects. The packages can be grouped broadly into four types:

 - **Core UI**. React component libraries: [`sdk`](packages/sdk) provides the core UI components and theming, [`shell`](packages/shell) provides the UI for selecting and controlling data and [`catalogue`](packages/catalogue) provides the UI for browsing and selecting widgets
 - **Widgets**. four example widgets built on the SDK: [`connections-table`](packages/connections-table), [`dht-buckets`](packages/dht-buckets), [`streams-table`](packages/streams-table), [`events-table`](packages/events-table), [`streams-table`](packages/streams-table),
 - **Node.js scripts**. Utilities for creating new widgets ([`create-widget`](packages/create-widget)), performing common data operations in Node.js or a React build ([`data`](packages/data)), converting binary Protobuf messages to or from JavaScript ([`proto`](packages/proto)), and generating or importing mock LibP2P Introspection data in protobuf format ([`samples`](packages/samples))
 - **Developer tools**. A demo [`app`](packages/app) that deploys a catalogue containing each example widget, and [`testing`](packages/testing) utilities to aid testing widget components in Jest and Storybook.

For more detail on packages and a more detailed overview, see the [packages directory readme](packages)

<a id="documentation"></a>
## Documentation

 - [Contribute](docs/contribute) for how to contribute work built on this toolkit to the LibP2P community, and how to contribute to this project itself.
 - [Developer Guide](docs/developer-guide) for a more detailed overview and explanation of how this project is structured, with pointers to developer resources available.
 - [File Format](docs/file-format) for the specification of the format of binary data that the LibP2P Observer expects
 - [Introspection Data Emitting Protocol] for an overview of the data protocol by which a LibP2P Observer widget and shell interacts with a LibP2P Introspection server
 - [Packages readme](packages) details how packages are used and each individual package has its own readme documentation