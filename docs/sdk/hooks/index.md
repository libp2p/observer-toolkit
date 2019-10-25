# libp2p-introspection-ui SDK hooks

These hooks are used to modify and shape data for use in components, based on stored state about user preferences and selections about how that data should be shaped and shown.

They are [custom React hooks](https://reactjs.org/docs/hooks-intro.html), which means they must follow the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html), which include:

- Must be called in the body of a function component, or in another hook (not in another function or callback)
- Must be called on every React render of that function component or hook (not in a condition like `if` or after a conditional `return`)

### Data formatters

- **[`useTabularData`](./useTabularData.md)** Prepares data in table-like structures, where each datum is a row-like array with each index following a column-like schema.
- `useStackedData` _TBC_ data structures with ordered, keyed cumulative totals, based on [D3.stack](https://github.com/d3/d3-shape/blob/v1.3.5/README.md#stack)
- `useHierachicalData` _TBC_ tree-like traversable and deep-sortable data structures based on [D3.hierarchy](https://github.com/d3/d3-hierarchy/blob/v1.1.8/README.md#hierarchy)

### Data manipulation

- **[`useSorter`](./useTabularData.md)** Generates data-specific sorting functions based on state storing user sorting preferences.
- `useFilters` [WIP](https://github.com/nearform/libp2p-introspection-ui/pull/4) Manages an array of active filtering functions, configurable by user interactions with UI components, with state storing filter-specific preferences.
