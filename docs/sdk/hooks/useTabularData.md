# useTabularData

Generates and returns a tabular data structure, `tableContentProps`, where an array of arrays represents rows of cells, and `columnDefs`, an array of column definitions including renderers for those cells. This is ready to pass to a component.

Also returned are functions for sorting the data (`setSortColumnIndex` and `setSortDirection`, and (TODO) function(s) for filtering the data (`dispatchFilters`).

The most common use case is to render `<td>` table cells and `<th>` table headers in a `<table>`, but tabular data may be used for any output that renders a discreet element for each intersection (cell) of consistently formatted data (rows) and consistently specified fields (columns).

Examples of use include:

 - [`DataTable`], a base component that expects tabular data
 - [`ConnectionsTable`], a component building on DataTable that uses `useTabularData`.

## Returns

`{` [`tableContentProps`](#tableContentProps), [`columnDefs`](#columnDefs), [`sortColumn`](#sortColumn), [`setSortColumn`](#setSortColumn), [`sortDirection`](#sortDirection), [`setSortDirection`](#setSortDirection) `}`

#### `tableContentProps`
> _`array`_

An array representing rows,  of arrays representing cells, containing `props` objects with the following:
 - **`value`** (any type): The unformatted content of the "cell". This is also used in sorting and filtering.
 - **`rowIndex`** (`number`): The index of the row this cell is in (where 0 is the first row of data, and any row of table headers is not counted)
 - **`columnIndex`** (number): The index of the column this cell is in, where `columnDefs[columnIndex]` will be the column definition this cell follows

#### `columnDefs`
> _`object`_

A definition for the columns based on the [`columns` prop](#columns), with default values applied.

#### `sortColumn`
> _`string`_

The `name` of the [column definition](#columns) that the data is currently sorted by. Stateful within `useTabularData`. May be null.

#### `setSortColumn`
> _`function`_  (`sortColumn` _`string`_)

A function from `useState` setting the `sortColumn` state inside this implementation of `useTabularData`.

#### `sortDirection`
> _`string`_

The sort direction state of the implementation of [`useSorter`](./useSorter.md) inside `useTabularData`. Typically `asc` (ascending) or `desc` (descending), though custom sorters may define their own.

#### `setSortDirection`
> _`function`_ (`sortDirection`  _`string`_)

A function from `useState` setting the `sortDirection` state inside the implementation of [`useSorter`](./useSorter.md) inside this implementation of `useTabularData`.

## Props

`{` [`columns`](#columns), [`data`](#data), [`defaultSort`](#defaultSort), [`defaultFilter`](#defaultFilter) `}`

#### `columns`
> _`array` required_)

An array of objects defining the "columns" of the data, following this schema (defined [link to code]):

 - **`name`** (`string`, required): A unique string used to reference this column.
 - **`header`** (`node`, defaults to `name`): User-facing React-renderable content (string or component) that describes the column. In DataTable, this is rendered in the `<th>` element.
 - **`getProps`** (`function` (`datum`::_`object`_), default returns `{ value: datum[name] }`): This processes the raw datum relating to this cell and returns a props object that can be passed to the appropriate component render function. The returned object always has a `value` key, and may have any other custom props required.
 - **`render`** (`function` (`props`::_`object`_): User-facing React component that renders the cell content from the props returned by `getProps`.
 - **`sort`** (`object`): Properties for [`useSorter`](link) if this column is sortable
 - **`filter`** (`object`): Properties for [`useFilter`](link) if this column is filterable

#### `data`
> _`array` required_

An array of objects, where each object is a raw datum containing data representing one row. These objects may be of any shape or class and will be parsed into render props by the columns' `getProps` functions.

#### `defaultSort`
> _`string`_

If this data contains columns that are sortable, and should be sorted by default, this object contains the `name` of the column that should be used to sort the data when no sort selection has been made.

#### `defaultFilter`
> _`object`_

TODO...


