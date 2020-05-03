# libp2p-introspection-ui

User interface for visualising libp2p introspection data.

## Setup

To get started locally, clone the repo, and run `yarn install`.

Run `npm run start:catalogue` to run a dev build of the `catalogue` package, containing a UI for browsing built-in React widgets and connecting these to a data source. When the UI is loaded, three types of data source are available:

### Sample data

Pre-made data samples are provided to show how the UI works. They can be loaded using the `Sample data` button and selecting one of the datasets.

### Upload a file

Just like the pre-made samples, it's possible to upload your own dataset. Compatible datasets can be exported using the ui's "Export data" button, and mock data files can be generated using the command `npm run mock-file` with optional flags below.

### Live connection

To get live introspection data streaming into the UI, it's possible to make a websocket connection to a live LibP2P node. 

 - A mock data server can be started using the command `npm run mock-sock` with optional flags below. The predefined url `ws://127.0.0.1:8080/` can be used to connect. 
 - To connect to real live LibP2P data, find the port on which the `introspect` server is running and connect to that appending `/introspect`. For example, if it runs locally on port 12345, connect to `ws://localhost:12345/introspect`.

## Mock data

To run generate mock data that simulates a LibP2P network with randomised activity, use one of these two commands: 

- `npm run mock-sock` starts a mock data server on port 8080 that can be connected to via a websocket 
- `npm run mock-file` writes a mock data file that can be uploaded

Both [accept several options](tree/master/packages/samples/readme.md) to define certain aspects of the mock P2P network or output.

## REPL

A simple way to connect to real LibP2P activity is using the [LibP2P REPL](https://github.com/libp2p/repl):

 1. Clone https://github.com/libp2p/repl and follow its setup instructions
 2. Find and copy the REPL's listening port by:choosing "My Info" in the REPL CLI then finding the listed "Introspection server Listen Address"
 3. Generate some activity using the REPL CLI. The option "DHT: Bootstrap (public seeds)" generates a lot of connection and DHT activity.
 4. In the catalogue UI, connect to the websocket address copied earlier, appending `/introspect`. For example, if My Info gave a listening address of 127.0.0.1/12345, connect to `ws://127.0.0.1:12345/introspect`


# Packages overview

This is a [Lerna monorepo](https://github.com/lerna/lerna), managed with [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/), containing the following packages:

## Core UI packages

- [**`packages/catalogue`**](tree/master/packages/catalogue): A React app containing the interface for selecting a widget and connecting to a data source.
- [**`packages/sdk`**](tree/master/packages/sdk): A Software Development Kit consisting of a library of components, hooks and utilities used across all widgets and UI packages.
- [**`packages/shell`**](tree/master/packages/shell): Common React components comprising the interface around an active widget, including data timeline and filter controls.

## Node.js scripts

- [**`packages/create-widget`**](tree/master/packages/create-widget): Generates a new empty widget based on CLI input, and is compatible with `npm init` and `yarn create`. 
- [**`packages/data`**](tree/master/packages/data): Helper functions for common operations on LibP2P Introspection protobuf data. 
- [**`packages/proto`**](tree/master/packages/proto): The definition and Javscript encoder/decoder of the protobuf used for LibP2P introspection data, with utilities for bundling and unpacking the protobuf data alongside checksums and byte counts. 
- [**`packages/samples`**](tree/master/packages/samples): Scripts for generating mock LibP2P Introspection data, saved to a binary file or via a mock websocket server. Also includes a set of pre-generated sample files. 

## Widgets

A "widget" is a React app based on the SDK for visualising LibP2P Introspection data that can be run inside the Catalogue or Shell.

- [**`packages/connections-table`**](tree/master/packages/connections-table) An interactive data table showing the connections observed at a user-selected point in time, including cumulative traffic, peer Ids, connection status and transports.
- [**`packages/dht-buckets`**](tree/master/packages/events-table) A visualisation of live activity of peers on the DHT routing table. Currently on hold due to ongoing changes to the LibP2P DHT model.
- [**`packages/events-table`**](tree/master/packages/events-table) A configurable interactive data table showing incoming events in real time, based on provided data about known event types.
- [**`packages/streams-table`**](tree/master/packages/streams-table) A streams datatable added to demonstrate switching between visualizations in the catalogue.
