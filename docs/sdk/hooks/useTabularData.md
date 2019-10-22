# useTabularData( `props` )

Generates and returns `tableContentProps`, a tabular data structure where an array of arrays represents rows of cells, and `columnDefs`, an array of column definitions including renderers for those cells. This is ready to pass to a component.

Also returned are functions for sorting the data (`setSortColumnIndex` and `setSortDirection`, and (TODO) function(s) for filtering the data (`dispatchFilters`).

The most common use case is to render `<td>` table cells and `<th>` table headers in a `<table>`, but tabular data may be used for any output that renders a discreet element for each intersection (cell) of consistently formatted data (rows) and consistently specified fields (columns).

Components that use tabular data include:

 - [DataTable], and instances of DataTable such as:
  - [ConnectionsTable]

## Returns

An object containing:

 - *`columnDefs`* (`object`): A definition for the columns based on the `columns` prop below, with defaults applied.
 - *`tableContentProps`* (`array`): An array representing rows,  of arrays representing cells, containing `props` objects with the following:
   - *`value`* (any type): The unformatted content of the "cell". This is also used in sorting and filtering.
   - *`rowIndex`* (`number`): The index of the row this cell is in (where 0 is the first row of data, and any row of table headers is not counted)
   - *`columnIndex`* (number): The index of the column this cell is in, where `columnDefs[columnIndex]` will be the column definition this cell follows

## Props

`{` [`columns`](jumplink), [`data`](jumplink), [`defaultSort`](jumplink), [`defaultFilter`](jumplink) `}`

#### *`columns`* (`array`, required)

An array of objects defining the "columns" of the data, following this schema (defined [link to code]):

 - *`name`* (`string`, required): A unique string used to reference this column.
 - *`header`* (`node`, defaults to `name`): User-facing React-renderable content (string or component) that describes the column. For example, in DataTable, this is rendered in the `<th>` element.
 - *`getProps`* (`function (datum:object)`, default returns `{ value: datum[name] }`): This processes the raw datum relating to this cell and returns a props object that can be passed to the appropriate component render function. Returns an object with a `value` key and any other custom props required.
 - *`render`* (`function (props:object)`): User-facing React component that renders the cell content from the props returned by `getProps`.
 - *`sort`* (`object`): Properties for `useSorter` if this column is sortable
 - *`filter`* (`object`): Properties for `useFilter` if this column is filterable

 #### `data` (`array`, required)

 An array of objects, where each object is a raw datum containing data representing one row. These objects may be of any shape or class and will be parsed into render props by the columns' `getProps` functions.

#### `defaultSort` (`string`)

If this data contains columns that are sortable, and should be sorted by default, this object contains the `name` of the column that should be used to sort the data when no sort selection has been made.

### `defaultFilter` (`object`)

TODO...


