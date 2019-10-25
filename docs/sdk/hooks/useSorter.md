# useSorter

Generates and returns a sorting function, `sorter`, that has a defined direction and optional preprocess mapping function.

Also returned are a string, `sortDirection`, giving the current stateful direction of sorting, and a function, `setSortDirection`, to update this state and return an updated sorting function.

Examples of use include:

 - [`useTabularData`](./useTabularData.md), a hook creating a sortable data structure based on rows and columns,
 - (TODO) `useStackedData`, a hook creating a data structure based on culmative values using [`d3.stack`](https://github.com/d3/d3-shape#stack)
 - The [`connections-table` package](/packages/connections-table) includes an example custom sorter, [`statusSorter`](/packages/connections-table/utils/statusSorter.js)

## Returns

`{` [`sorter`](#sorter), [`sortDirection`](#sortDirection), [`setSortDirection`](#setSortDirection) `}`

#### `sorter`
> _`function`_ (`a` _`any`_, `b` _`any`_)

A sorting function generated based on the supplied properties.

#### `sortDirection`
> _`string`_

The sort direction state of this implementation of `useSorter`. Typically `asc` (ascending) or `desc` (descending), though custom sorters may define their own.

#### `setSortDirection`
> _`function`_ (`sortDirection`  _`string`_)

A function from `useState` setting the `sortDirection` state inside this implementation of `useSorter`.

## Props

`{` [`columns`](#columns), [`data`](#data), [`defaultSort`](#defaultSort), [`defaultFilter`](#defaultFilter), ['disabled'](#disabled) `}`

#### `getSorter`
> _`function`_ (`sortDirection` _`string`_) _required_

A function returning a sorting function that takes arguments `a` and `b` and sorts them based on the supplied `sortDirection`.

Built-in numeric and case-insensitive string sorters are provided (`getNumericSorter` and `getStringSorter`).

#### `mapSorter`
> _`function`_ (`sortable` _`any`_)

An optional function for preprocessing the arguments to the sorting function. Use this, for example, to sort objects by a specific property, or to transform values before sorting by them.

#### `defaultDirection`
> _`string` required_

The initial state that will be passed to `getSorter` to set the initial direction of sorting.

#### `directionOptions`
> _`array`_

An array of arrays containg (`[0]`) the valid values for `sortDirection` and (`[1]`) user-facing label strings to be used in UI components.

#### `disabled`
> _`bool`_

If true, useSorter returns a sort function that applies no changes.
