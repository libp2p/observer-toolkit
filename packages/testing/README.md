# `testing` @libp2p/observer-testing

This package contains testing utilities to ease development of LibP2P Observer widgets and the LibP2P Observer project itself.

## Environments

This package may be used for both `jest` tests running in node.js and for in-browsing demoing with Storybook, and has different entry points for each case:

### Use in node.js in `jest`

Through the `main` entrypoint, [index.test.js](index.test.js), this exports:

 - A function `loadSample` that loads sample data using Node.js's `readFile` API
 - Context-providing wrapper components that load sample data using `loadSample`
 - [mock-messages](mock-messages) - functions that return simple objects that can pass as mock `event`, `runtime` and `state` messages without causing errors
 - [test-utils](test-utils) for use with React Testing Library  and Jest, including [custom queries](queries) and a utility function to simulate nudging the timeline slider by one

### Use in browsers with `storybook`

Through the `browser` entrypoint, [index.browser.js](index.browser.js), this exports:

 - A function `fetchSample` that loads sample data using a browser's `fetch` API
 - Context-providing wrapper components that load sample data using `fetchSample`
 - [mock-messages](mock-messages) - functions that return simple objects that can pass as mock `event`, `runtime` and `state` messages without causing errors
