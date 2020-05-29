# `packages`

<!-- MarkdownTOC -->

- [1. Lerna packages explained](#1-lerna-packages-explained)
- [2. Summary of packages by type](#2-summary-of-packages-by-type)
  - [2.1 Core UI packages](#21-core-ui-packages)
  - [2.2 Widgets](#22-widgets)
  - [2.3 Node.js scripts](#23-nodejs-scripts)
  - [2.4 Developer tools](#24-developer-tools)

<!-- /MarkdownTOC -->


<a id="1-lerna-packages-explained"></a>
## 1. Lerna packages explained

Each directory in this directory represents a [lerna package](https://github.com/lerna/lerna#about). Yarn is configured to treat each package as a [Yarn Workspace](https://classic.yarnpkg.com/en/docs/workspaces/). 

Each has its own `package.json` and `node_modules` directory, and its own dependencies.

Each is published to NPM as an independent package, with a name like `@libp2p/observer-${name}`. For example:

 - `catalogue` is published as `@libp2p/observer-catalogue`
 - `connections-table` is published as `@libp2p/observer-connections-table`
 - `create-widget` is the only **exception** to the pattern: for compatibility with `yarn create` and `npm init`, it is published as `@libp2p/create-observer-widget` 

When working locally, after running `yarn install`:

 - All packages' dependencies are installed according to each package's `package.json`.
 - Packages that have each other as dependencies reference each other using **symlinks**. This makes it easy to work on PRs and other units of work that require interdependent changes to multiple packages.
 - Yarn "hoists" common dependencies to the root `node_modules` directory. This helps us ensure that, for example, the exact same versions of React and Styled Components are used everywhere, avoiding the errors that can occur if a build ends up using multiple versions of one of these dependencies.


<a id="2-summary-of-packages-by-type"></a>
## 2. Summary of packages by type


<a id="21-core-ui-packages"></a>
### 2.1 Core UI packages

- [**`packages/catalogue`**](catalogue): React components, pages and routing for building browsable catalogues of LibP2P Observer widgets based on a provided list of widgets.
- [**`packages/sdk`**](sdk): A Software Development Kit consisting of a library of core components, hooks, theming and utilities used across all widgets and UI packages.
- [**`packages/shell`**](shell): React components comprising the common interface around an active widget, such as data timeline, data selection tools, settings and filter controls.

<a id="22-widgets"></a>
### 2.2 Widgets

A "widget" is a React app based on the [LibP2P Observer SDK](sdk), for visualising LibP2P Introspection data. Each widget is expected to run inside the [LibP2P Observer Shell](shell) and may be included in a [LibP2P Observer Catalogue](catalogue).

- [**`packages/connections-table`**](connections-table) An interactive data table showing the connections observed at a user-selected point in time, including cumulative traffic, peer Ids, connection status and transports.
- [**`packages/dht-buckets`**](events-table) A visualisation of live activity of peers on the DHT routing table. Currently on hold due to ongoing changes to the LibP2P DHT model.
- [**`packages/events-table`**](events-table) A configurable interactive data table showing incoming events in real time, based on provided data about known event types.
- [**`packages/streams-table`**](streams-table) A streams datatable added to demonstrate switching between visualizations in the catalogue.


<a id="23-nodejs-scripts"></a>
### 2.3 Node.js scripts

- [**`packages/create-widget`**](create-widget): Generates a new empty widget based on CLI input, and is compatible with `npm init` and `yarn create`. 
- [**`packages/data`**](data): Helper functions for common operations on LibP2P Introspection protobuf data. 
- [**`packages/proto`**](proto): The definition and Javscript encoder/decoder of the protobuf used for LibP2P introspection data, with utilities for bundling and unpacking the protobuf data alongside checksums and byte counts. 
- [**`packages/samples`**](samples): Scripts for generating mock LibP2P Introspection data, saved to a binary file or via a mock websocket server. Also includes a set of pre-generated sample files. 


<a id="24-developer-tools"></a>
### 2.4 Developer tools

- [**`packages/app`**](app): A React app, based on [Craco](https://github.com/gsoft-inc/craco), which builds a demo LibP2P Observer catalogue containing the widgets included in this repo.
- [**`packages/testing`**](testing) Utilities for easing testing of React components, including scripts and fixtures for loading data in Jest and Storybook, and custom queries for [react-testing-library](https://testing-library.com/docs/react-testing-library/intro).