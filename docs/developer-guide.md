# Developer Guide

<!-- MarkdownTOC -->

- [1. Overview](#1-overview)
  - [1.1 Recieving data in the React app](#11-recieving-data-in-the-react-app)
  - [1.2 Consuming data in the React app](#12-consuming-data-in-the-react-app)
  - [1.3 Widgets](#13-widgets)
  - [1.4 Creating widgets](#14-creating-widgets)
- [2. In-browser testing](#2-in-browser-testing)
  - [2.1 App development builds](#21-app-development-builds)
  - [2.2 Storybook](#22-storybook)
  - [2.3 Accessing data in the browser console](#23-accessing-data-in-the-browser-console)
- [3. Code style and linting](#3-code-style-and-linting)
- [4. Tests](#4-tests)
  - [4.1 Testing libraries](#41-testing-libraries)
  - [4.2 Testing approach and coverage](#42-testing-approach-and-coverage)
  - [4.3 Snapshot tests](#43-snapshot-tests)
- [5. Continuous Integration](#5-continuous-integration)
- [6. Publishing](#6-publishing)
  - [6.1 Publishing to NPM](#61-publishing-to-npm)
  - [6.2 Publishing locally on Verdaccio](#62-publishing-locally-on-verdaccio)
  - [6.3 Publishing to Github Packages](#63-publishing-to-github-packages)

<!-- /MarkdownTOC -->


<a id="1-overview"></a>
## 1. Overview

The following are used extensively in LibP2P Observer: 

  1. [**React hooks**](https://reactjs.org/docs/hooks-overview.html) is the backbone of how LibP2P Observer and all widgets built on it consume and prepare data, and how all components handle state
   - Following the [rules of hooks](https://reactjs.org/docs/hooks-rules.html) is essential for stability and is enforced by [the project's lint](#3-code-style-and-linting)
   - The hooks [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) and [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) are particularly heavily used in data management and propogation 
  2. [**Styled Components**](https://www.styled-components.com/) is used for all styling and theming.
   - The default LibP2P Observer theme is defined in [sdk/theme](packages/sdk/theme)
   - Themes are propogated using the SDK's [ThemeSetter component](packages/sdk/components/context/ThemeSetter.js)
   - The [catalogue package](packages/catalogue)'s exported `Catalogue` component accepts `theme` as an optional prop and applies either it or the default theme using ThemeSetter
  3. [**D3**](https://d3js.org/) is used, but only for processing data and generating component props, such as co-ordinates, lengths and path definitions. D3's methods that interact directly with the DOM, such as `.select()`, `.enter()` and `.append()`, are *_not_* used, to avoid conflicts with React's tight management of a virtual DOM.

<a id="11-recieving-data-in-the-react-app"></a>
### 1.1 Recieving data in the React app

- Data from a LibP2P Introspection server are received, wrapped in metadata for versioning as defined on the [File Format](/file-format.md) documentation.
- Binary protobuf messages are extracted and parsed using the Javascript protobuf parser in the [proto](packages/proto) package. This generated file is updated only in rare cases where the protobuf definition shared with the LibP2P Introspection module changes.
- Parsed protobuf messages become JavaScript objects, containing data in arrays and with an API of getter and setter methods based on the protobuf schema. For example, if the protobuf message schema includes a field `some_field`, it will be decoded in JavaScript as an object with an array that includes the field's value and prototype methods `.getSomeField()` and `.setSomeField()`.
- The main message types received by the LibP2P Observer are:
  - Runtime: An object containing information about the LibP2P Introspection server and the system it runs on, including metadata about known event types and settings on data lifespan and frequency. Only one runtime message is stored, with new runtime messages replacing the old.
  - Events: An array of objects with a `type` string, a timestamp integer, and JSON content conforming to a schema expected to be defined for this particular `type` in the runtime. Event messages are expected to be pushed by the LibP2P Introspection server as soon as possible after the event occurs.
  - States: An array objects describing the state of the introspection server at a moment in time. Unlike event messages, these are expected to be sent at a regular, agreed schedule defined in the runtime and edittable by `signal`
- The LibP2P Observer may also send `signal` messages to the LibP2P Introspection server, of the following types:
  - Pause signals, which cause events and state messages to be queued instead of sent
  - Unpause signals, which send any message queue and resume normal sending
  - Config signals, for setting variables such as the time interval between state messages and the maximum time period to keep old messages.

For more detail on protobuf message types, see the documentation for the [`proto` package](../packages/proto).

<a id="12-consuming-data-in-the-react-app"></a>
### 1.2 Consuming data in the React app

- In the [React Hooks](https://reactjs.org/docs/hooks-overview.html)-based LibP2P Observer app, these extracted LibP2P Introspection messages (Runtime, Events and States) are stored, sorted and filtered using the custom hook [`useDatastore`](), propogated throughout the app using the custom context provider [DataProvider](packages/sdk/components/context/DataProvider), and managed by the user using the [Observer Shell](packages/shell)
- The Data package provides many pure-JavaScript helper functions for facilitating common operations on LibP2P Introspection data. These may be used both inside the LibP2P Observer React components, and outside of React in node.js scripts or other UI tools.
- After the user has connected to a source of LibP2P Introspection data using the DataTray components of the shell package, they choose a widget using the UI provided by the [catalogue package](packages/catalogue) to visualise the data.
- Each widget may also define its own filters which the user may apply using the standard [WidgetHeader](packages/shell/components/WidgetHeader) components provided by the shell package, and its own contexts for re-propogating processed data.

<a id="13-widgets"></a>
### 1.3 Widgets

- A typical widget takes data from the DataProvider contexts, applies its own filters, passes this data to a data-shaping React hook (for example, the [useTabularData](packages/hooks/useTabularData) or [useStackedData](packages/hooks/useStackedData) hooks provided by the SDK), then passes the generated  co-ordinates, path definitions or similar as props to React components that visualise the data.
- Four example widgets are included:
  - [Connections Table](packages/connections-table), an interactive "drifting" data table of current and recently-closed connections
  - [Events Table](packages/events-table), a datatable that updates its own schema in real time based on the events observed by the LibP2P Introspection server
  - [DHT Buckets](packages/dht-buckets), a visualisation of the current contents and query activity of the peers on the routing tables of LibP2P's Distributed Hash Tables module. 
  - [Streams Table](packages/streams-table), an interactive datatable of current and recently active streams and their protocols.

<a id="14-creating-widgets"></a>
### 1.4 Creating widgets

- Users are encouraged to create their own widgets, using:

  - The [create-widget package](packages/create-widget) as a quickstart script, creating a boilerplate widget pluggable to the LibP2P Observer shell and catalogue, with dependecies, lint, testing and storybook config all set up.
  - The [SDK package](packages/sdk) for base components and data processing hooks
  - The [data package](packages/data) for data processing helper functions

<a id="2-in-browser-testing"></a>
## 2. In-browser testing

The [app](packages/app) package is built to GitHub pages and is accessible at https://nearform.github.io/libp2p-observer/

<a id="21-app-development-builds"></a>
### 2.1 App development builds

Run `npm run start:app` to start a development deployment of the demo app. A browser window will then open.

Any changes to local LibP2P Observer files in any package used in the app will cause a reload automatically and will be reflected in the local app.
 
<a id="22-storybook"></a>
### 2.2 Storybook

Many React components can be built and tested in a browser in isolation for simpler in-browser testing using Storybook. These update automatically with any code change. Any component file with a matching `*.stories.js` file can be previewed in Storybook like these. All storybook-enabled components in a package are run on a per-package basis like using these scripts:
   - `npm run storybook:connections-table`
   - `npm run storybook:dht-buckets`
   - `npm run storybook:sdk`
   - `npm run storybook:streams-table`

<a id="23-accessing-data-in-the-browser-console"></a>
### 2.3 Accessing data in the browser console

The current data stored in the LibP2P Observer is made available to the user via an object `window.libp2pObs`. Many API functions are also exposed, including all functions in the [data package](packages/data).

More detail on what is available is printed to the browser console. Users are encouraged to use this for debugging, exploration and experimentation.

<a id="3-code-style-and-linting"></a>
## 3. Code style and linting

This repo uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) to ensure consistency of coding styles. Commits apply auto-fixes and lint is automatically checked on each `git push`, using [husky](https://github.com/typicode/husky). You may find the following convenient:
 - `npm run lint-fix` checks all packages, automatically restyles code to meet the linting rules wherever possible, and gives a report of any remaining problems needing manual fixing. 
 - `npm run lint` tests lint and outputs a report of any problems without changing any code or applying any auto-fixes
 - Many text editors have eslint plugins which will check against the correct linting rules as you type with no additional configuration needed

Most linting rules are consistent throughout all directories and packages, but a few exceptions are necessary:

 - Scripts run in node.js, such as the [samples]() package and files outside of `/packages/`, use commonjs `require`s and `use strict`
 - The command to regenerate the protobuf generated files in the [proto]() package, `npm run protoc`, writes in exception to the no undefined rule, because the generated file contain undefined globals


<a id="4-tests"></a>
## 4. Tests

`npm run test` will run tests in all packages, after preparing updated builds of all packages with a `webpack.config.js` file.

This can take a long time, so while working on just one package, it may be more convenient to run only that package's test suite by either running `npm test` in that package's directory or, for a given $PACKAGE_NAME, running `npx lerna exec --scope="$PACKAGE_NAME" -- npm run test` in this project's root directory.

<a id="41-testing-libraries"></a>
### 4.1 Testing libraries

Most packages are primarily or exclusively consuming within React, and are covered by Jest tests based on React Testing Library. The `testing` package adds additional tooling to ease writing tests. See the [testing package documentation](packages/testing) for more details.

The exceptions to this are [create-widget](packages/create-widget) and [samples](packages/samples) packages which contain node.js scripts to be used from the CLI outside of React. These use the simpler [Node Tap](https://node-tap.org/) library.

All test files of both types are suffixed `.test.js`.

<a id="42-testing-approach-and-coverage"></a>
### 4.2 Testing approach and coverage

Where possible, tests follow the [Testing Library philosophy](https://testing-library.com/docs/guiding-principles) of reflecting user actions and expectations, and prioritise testing functions that could fail quietly (particularly, data operations that could appear to succeed while giving non-obviously erroneous output).

As such, there are no formal coverage requirements, and tests are prioritised case-by-case for quality and usefulness. Contributions that increase test coverage are welcome, but on the condition that the new tests are useful beyond merely increasing coverage.

Uncovered code may be identified using `npm run test:cov`.

<a id="43-snapshot-tests"></a>
### 4.3 Snapshot tests

[Snapshot tests](https://jestjs.io/docs/en/snapshot-testing) for React components are used to avoid unexpected or unintended changes to styling or HTML output. Because over-use of snapshots can increase maintainence burden and obscure significant changes, these are limited to leaf components that have relatively stable stlying.

The command `npm run update-snapshots` updates all snapshot files, and `npm run test:update` runs the test suite after updating all snapshots against the latest builds.

A suggested workflow is to run `npm run test:update` before pushing, and check that any changes to snapshot files reflect expected and intentional changes to styling.

<a id="5-continuous-integration"></a>
## 5. Continuous Integration

This repo uses GitHub Actions for CI, to run the full test suite on each push to a published branch, and to update a GitHub Pages build of the App package automatically on each push to master or on manual pushes to a staging branch. These actions' configuration can be seen in the [`.github` directory](.github/).

<a id="6-publishing"></a>
## 6. Publishing

This repo publishes packages independently, meaning only changed packages gain new releases and version numbers. See [Lerna's "independent mode" documentation](https://github.com/lerna/lerna#independent-mode) for details.

<a id="61-publishing-to-npm"></a>
### 6.1 Publishing to NPM

All approved releases are to be published to the public NPM registry.

Publishing is done manually, not automatically, to allow for manual checks and appropriate scheduling.

<a id="62-publishing-locally-on-verdaccio"></a>
### 6.2 Publishing locally on Verdaccio

In some cases, it may be useful to publish work-in-progress to a mock local NPM registry, to check the published bundle behaves as expected. This is particularly useful for testing changes to the `create-widget` package. To support this, LibP2P Observer includes the following commands:

 - `npm run start:verdaccio` to run a local Verdaccio registry. See the [LibP2P Observer/verdaccio documentation](verdaccio/) for details and requirements.
 - `npm run local-publish` to publish the current packages to the local Verdaccio registry, without updating any Git tags, using version numbers based on the state of the local registry (not changing version numbers for the initial publish).
 - `npm run local-unpublish` to unpublish the latest releases of each package on the local Verdaccio registry.
 - `npm run local-unpublish-all` to unpublish all versions of the repo's packages from the local Verdaccio registry.
 - `npm run local-install` to install packages from the local registry without updating yarn.lock

A locally-pubished test package set on Verdaccio then be used to create a test widget with:

```
YARN_REGISTRY="http://localhost:4873/" yarn create @nearform/observer-widget`
```

Locally published packages can be installed into a respository, such as a widget, catalogue, or local branch of [LibP2P Observation Deck](https://github.com/nearform/libp2p-observation-deck/), using the same env variable with `yarn install`:

```
YARN_REGISTRY="http://localhost:4873/" npx yarn install
```

<a id="63-publishing-to-github-packages"></a>
### 6.3 Publishing to Github Packages

If it is necessary to share an exact package set beyond one local machine, Github Packages can be used. Note that this should only be used in rare cases with the agreement of the core team, as it may cause conflict with existing packages published to GitHub, and packages will be published to the namespace of the github owner.

A GitHub personal access token with permissions to access repositories and access and create packages is required and must be used with these commands.

- `npm run gh-publish-bump` publishes all packages and uses Lerna's CLI tool to allow the user to select version numbers for packages Lerna judges to have been updated.
- `npm run gh-publish-same` publishes packages using Lerna's `from-package` keyword and without updating git tags, allowing the current version number to be re-published if it is not present or has been manually removed from GitHub packages.

Note that as of summer 2020 there are compatibility issues with Github Actions failing to use Personal Access Tokens to authenticate private Github Packages using Yarn. Github Workflows requiring access to private packages via Yarn are not recommended.
