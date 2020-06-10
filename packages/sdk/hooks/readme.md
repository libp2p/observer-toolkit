# SDK hooks

These are [custom React hooks](https://reactjs.org/docs/hooks-custom.html) - functions called in the React render phase which obey the [rules of hooks](https://reactjs.org/docs/hooks-rules.html) and can therefore use other React hooks just like a React component can.

- [Hook props and arguments](#hook-props-and-arguments)
- [Hooks exported by the SDK](#hooks-exported-by-the-sdk)
  - [`useAreaChart`](#useareachart)
  - [`useCalculation`](#usecalculation)
  - [`useCanvas`](#usecanvas)
  - [`useConsoleAPI`](#useconsoleapi)
  - [`useDatastore`](#usedatastore)
  - [`useFileBlob`](#usefileblob)
  - [`useFilter`](#usefilter)
  - [`useHandlerOnRef`](#usehandleronref)
  - [`useHidePrevious`](#usehideprevious)
  - [`usePooledData`](#usepooleddata)
  - [`useSorter`](#usesorter)
  - [`useStackedData`](#usestackeddata)
  - [`useTabularData`](#usetabulardata)

<a id="hook-props-and-arguments"></a>
## Hook props and arguments

Most custom hooks in this SDK accept one object argument, `props`, which is destructured like a component's props and type-checked manually using [`PropTypes.checkPropTypes()`](https://github.com/facebook/prop-types#proptypescheckproptypes). This allows developers using the SDK to benefit from browser console mistyping warnings and easy in-code type guidance for hooks, the same as for components.

Be aware that this prop type checking of hook props is a convenience specific to this repo, and not a mandated rule of React Hooks. The completeness of prop types for hooks are therefore not automatially checked by lint like they are for components.

In any hooks file where the argument is `props`, a propTypes object can be at the end of the file.

<a id="hooks-exported-by-the-sdk"></a>
## Hooks exported by the SDK

<a id="useareachart"></a>
#### [`useAreaChart( props )`](useAreaChart.js)

Consumes the output of `useStackedData` along with pixel `height` and `width` dimensions and returns an array of objects containing:

- `key`: The unique key of the `useStackedData` datum.
- `pathDef`: A string containing a path definition the area shape visualising this datum in a [D3 Area Chart](https://github.com/d3/d3-shape#areas). These may be applied to [SVG `<path>`](](https://developer.mozilla.org/en/docs/Web/SVG/Tutorial/Paths)) elements' `d` attributes, or a [Canvas Path2D](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D) constructor.


<a id="usecalculation"></a>
#### [`useCalculation( function, array )`](useCalculation.js)

Calls a given function based on types of available context named in the given array, and caches its result using React's [`useMemo`](), only repeating the function when one of the named contexts changes. Returns the latest result of the function.

Intended for use where a complex, performance-heavy calculation using contexts needs to be specified somewhere outside of React's render pipeline then called inside it.

<a id="usecanvas"></a>
#### [`useCanvas( props )`](useCanvas.js)

For given dimensions and optional animation function, returns an object containing:

- `canvasRef`: a [`useRef`]() object to be passed as a `ref` prop to a `<canvas>` element
- `animationRef`: a [`useRef`]() object which carries status data about the current animation frame and animation transition status
- `getCanvasContext`: a function cached with [`useCallback`] that returns the specified render context of the `<canvas>` element (by default, `CanvasRenderingContext2D`)

This is used to assist drawing Canvas elements that persist on re-renders, resize as their width and height changes (e.g. window resizes) and continue animations through re-renders.

<a id="useconsoleapi"></a>
#### [`useConsoleAPI( props )`](useConsoleAPI.js)

Exposes libp2p observer data to the console via the `window` object and prints a description of the data available.

<a id="usedatastore"></a>
#### [`useDatastore( props )`](useDatastore.js)

Manages the central source of libp2p Introspection data and metadata and returns the current data and updater functions.

The data stored in `useDatastore` represents what is held in memory: data removed here will be unretrievable and up for garbage collection. Any filters selected by the user using UI tools are applied outside of this hook (for example, global filters are applied in [`DataProvider`](), before propogating the data store contents as contexts).

An object is returned, containing:

- `states`: An array of states messages, managed by `useReducer`, sorted by end time and with states earlier that the current runtime cutoff time erased. If no data is resent, an empty array is returned.
- `events`: An array of states messages, managed with `useReducer`, sorted by event time and with events earlier that the current runtime cutoff time erased. If no data is resent, an empty array is returned.
- `runtime`: The current `runtime` message; or `null`
- `peerIds`: An array of peerId strings reflecting current user selections
- `source`: An object containing metadata on the current data source; or `null`. The object contains:
  - `name`: String describing the specific current data source, such as a file's filename or a websocket's URL
  - `type`: String, either `sample`, `upload` or `live` indicating one of the three user-selectable options when choosing a data source
  - `isLoading`: Boolean, true if the data source is not yet fully loaded (for example, while a file is being uploaded or between the initiation and connection of a websocket)


- `websocket`: `null` except when there is an active websocket connection, in which case this is an object managed by `dispatchWebsocket` via [`useReducer`](), with keys:
  - `ws`: The current [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) instance.
  - `isPaused`: Boolean changing as pause signals are sent.
  - `hasData`: Boolean set to `false` until first data is received over this websocket connection.
  - `sendSignal( cmd:string, content:string )`: Function writing and sending a protobuf signal message over the current websocket connection, with the given `cmd` and optional `content`.


- `setIsLoading( bool )`: A function setting only the `isLoading` key of the data `source`
- `updateData( { states, events, runtime } )`: A function cached with [`useCallback`]() that updates the runtime if one is provided, appends any provided events and states to the an existing dataset, and processes that data (updates the sort order if needed and removes any states or events that now exceed the runtime's cutoff time).
- `replaceData( { states, events, runtime, source } )`: A function cached with [`useCallback`]() that removes the existing dataset and replaces it with the data provided, processing that data as `updateData` does.
- `removeData( { source } )`: Clears the current data set. If a source is provided, it is applied (for example, describing a data source that has only just begun to load, where `source.isLoading = true`), otherwise the data store is left completely empty.
- `setPeerIds( peerIds )`: A [`useState`]() setter to set currently selected peerIds to either an array of strings or `null`.
- `updateRuntime( runtime )`: Replaces the current runtime message with either the provided message or `null`, then removes any states or events that are now invalid.
- `dispatchWebsocket( options )`: A [`useReducer`]() dispatch function managing the `websocket` object. The supplied `options` object must include an `action` string as listed below and the additional properties specified:
  - `'onOpen'` action expects `ws` WebSocket object and `sendSignal` function of the new websocket connection.
  - `'onData'` action accepts an optional `callback` function, which will be called with no arguments passed.
  - `'onPauseChange'` action expects boolean `isPaused` true if now paused
  - `'close'` action closes the websocket passing a `reason` string and an optional `statusCode` number (default `1000`)

<a id="usefileblob"></a>
#### [`useFileBlob()`](useFileBlob.js)

Takes current data from contexts (after any global filters have been applied) and returns a blob of the data encoded into binary protobuf format and written to binary following the [file format specification](../../docs/file-format.md).

<a id="usefilter"></a>
#### [`useFilter( array )`](useFilter.js)

Combines any number of user-adjusable data filters into one filter function and allows that filter function to be updated by user actions.

Processes an array of filter definition objects of the following shape:

- `name`: String, should communicate what this filter does to a user
- `doFilter( datum, values )`: A function returning true if the given datum should be included after filtering
- `mapFilter(datum)`: An optional data accessor or transformation function; if provided, its return value is passed to `doFilter` instead of the original datum.
- `initialValues`: The initial set of user-editable `values` used in `doFilter`. These values may be updated using `dispatchFilters`; typically done by the user using UI form controls.

Returns an object with:

- `applyFilters(datum)`: A function, used like `dataArray.filter(applyFilters)`, which tests the given datum against every filter currently `enabled` using each such filter's current `values`
- `dispatchFilters( options )`: A [`useReducer`]() dispatch function used to update filter values. The supplied `options` object must include an `action` string as listed below and the additional properties specified:
  - `'update'` action expects `name` string identifying the filter to update and a `values` object to replace the existing filter `values`
  - `'enable'` action expects `name` string identifying the filter to enable
  - `'disable'` action expects `name` string identifying the filter to disable
  - `'reset'` action expects `name` string identifying the filter to reset to its already-held initial values.
- `filters`: An array of objects for each filter, including:
  - `name`: Matches the original filter definition
  - `values`: Object storing the current filter values
  - `enabled`: Boolean indicating if this filter currently should be included in the `applyFilters` function
  - `getFilterDef`: Function returning the original filter definition of this filter
  - Any other properties from the filter definition, such as components to use in the filter's editting UI.

<a id="usehandleronref"></a>
#### [`useHandlerOnRef( props )`](useHandlerOnRef.js)

For a given `handler` function and `targetRef` object from `useRef` assigned to a HTML element by passing it to a component as a `ref` property, this binds the handler to the HTML element for the given `eventType` (default: `click`) and unbinds it when the hook is mounted and unbinds it when it is unmounted. An optional `className` is also applied and removed (default: `clickable`).

This allows an element to have events that are contigent on other elements elsewhere in the DOM tree. For example, a parent element can have a click handler only when it has a certain child and that handler can depend on props or state of the child.

<a id="usehideprevious"></a>
#### [`useHidePrevious( function )`](useHidePrevious.js)

Returns a function, `hidePrevious( function )`, that calls (optional) the function passed to this hook and removes or replaces that function with the function passed to this `hidePrevious`.

This can be used to ensure only one of a set of any number of different components is shown at a time: call `useHidePrevious` in a common parent, and pass the returned `hidePrevious` function to each child that should be hidden when another is shown. In those components, call `hidePrevious(hide)` in any `show` function, where `hide` is a function hiding this component, and call `hidePrevious(null)` in any `show` function.

<a id="usepooleddata"></a>
#### [`usePooledData( props )`](usePooledData.js)

Organises an array of `data` into pools based on one or more continuous variables, counting the number of data points falling into each pool. Typically used for histograms, tallies and similar metrics.

How to pool data is defined in a `poolings` object with the following shape:

- `mapData( datum )`: Optional accessor or data transformation function returning the value each `datum` is to be pooled by
- `poolsCount`: Optional number setting the number of pools to use. If unset, a number will be chosen using [`d3.ticks`]()
- `scaleType`: Optional string (default `linear`), setting the scaling to be used in assigning pools, from the following options:
  - `linear`: Uses d3's [`scaleLinear`](). Each pool will cover the same range, and the pool boundaries will be chosen as evenly-spaced ["nice"]() round numbers based on the range of provided data.
  - `time`: Uses d3's [`scaleTime`](). Data are treated as timestamps, and each pool will cover the same time duration as with `linear` but the "nicing" of the data will be based on round times (e.g. timestamps that snap to exact minutes or hours)
  - `log`: Uses d3's [`scaleLog`](). Data are treated as simple numbers but pooled on a non-linear log10 scale: for example, pool boundaries might be >=0 && < 0.1, >=0.1 && < 1, >=1 && < 10, >= 10 && < 100...

The `poolings` prop may be an object with the above shape, or an array of objects with this shape. If an array is passed, the data within each pool will then be pooled again as specified by the next object in the poolings array.

Each `poolings` object generates an array, `poolSets`, setting the lower and upper boundaries of each pool. An array of fixed `poolSets` may be passed as an optional prop.

The hook returns an object containing:

- `pooledData`: An array of nested arrays containing the data in each pool. The depth of the nested arrays will match the number of `poolings` passed in.
- `poolSets`: An array of the pooling boundaries used to pool the data.
- `dispatchPoolings( options )`: A [`useReducer`]() dispatch function used to update the data and pooling settings. The supplied `options` object must include an `action` string as listed below and the additional properties specified:
  - `set` action: replaces previous poolings with the `poolings` object or array provided
  - `remove` action: Removes a pooling by its `index` in the poolings array.
  - `add` action: Appends the provided `poolings` object or objects in the provided `poolings` array to the current `poolings` array
  - `edit` action: Applies the provided `poolings` properties, leaving properties undefined in the passed `poolings` unchanged. If an array is passed, poolings update stored poolings at the same index position.

<a id="usesorter"></a>
#### [`useSorter( props )`](useSorter.js)

Generates a sorting function and returns it along with a string describing the sorting direction and a function update the sorting direction.

Expected props are:

- `getSorter( sortDirection:string )`: A function that returns a sorting function for a given direction.
- `mapSorter( datum )`: An optional accessor or data transformation function; if passed, the returned value is passed to the sorter instead of the original `datum`.
- `defaultDirection`: A string setting the initial direction to sort on first use.
- `directionOptions`: An optional array providing alternative sorting direction keys and labels if the default `asc` and `desc` are not appropriate.
- `disabled`: A boolean value disabling the sorter if `true`

Returns an object containing:

- `sorter( a, b )`: A function to be used like `dataArray.sort(sorter)`
- `sortDirection: A string matching the currently active item in `directionOptions`
- setSortDirection: A `useState` setter that updates `sortDirection` and causes a new `sorter` to be generated.

<a id="usestackeddata"></a>
#### [`useStackedData( props )`](useStackedData.js)

Stacks data using [`d3.stack`](), applying scales, keys and updatable sorting, returning an array of arrays of numbers each with a unique key linking it to the original datum and each containing values that include the sum of all previous values according to a given sorting order.

May be used with `useAreaChart` to produce stacked area charts.

Expected props are:

- `data`: An array of data to process
- `getKeys( data, ySorter, applyFilters )`: A function returning an ordered set of unique key strings from the data array
- `keyData( data, keys )`: A function returning an ordered array of objects with a numeric value for each key and a property for the x-axis value.
- `mapYSorter( datum )`: Passed to [`useSorter`]() for sorting the Y axis
- `mapXSorter( datum )`: Passed to [`useSorter`]() for sorting the X axis
- Optional properties for `useSorter`: `defaultYSortDirection`, `getYSorter`, `defaultXSortDirection`, `getXSorter`

Returns an object containing:

- `stackedData`: An array output from [`d3.stack`]()
- `xScale`: A [`d3.scale`]() object for the X axis
- `yScale`: A [`d3.scale`]() object for the Y axis
- `setXSortDirection`: From `useSorter`, for sorting the X axis
- `setYSortDirection`: From `useSorter`, for sorting the Y axis

<a id="usetabulardata"></a>
#### [`useTabularData( props )`](useTabularData.js)

Organises data based on treating items in a data array as "rows" which may be paginated, and applying a schema of "columns" where each column has a rendering component and optional sorting and filtering rules.

While primarily intended for preparing data for the `<DataTable>` component, nothing in this hook is specific to that component or to HTML `<table>` elements. It can potentially be used for many visualisation types where different components and sorting rules should be applied to each item in an array of data.

Expected props are:

- `columns`: An array of objects specifying a column. The keys used by this hook are:
  - `name`: A unique string identifying this column
  - `header`: An optional React node (string or render) labelling the column (`name` will be used if not set).
  - `getProps( datum, metadata )`: A function returning an object of properties for each datum in the `data` array. If undefined, a default function returns `{ value: datum[name] }`
  - `renderContent( props )`: A optional React component receiving the props from `getProps`; a simple component rendering the `value` prop as a string will be used if not set.
  - `sort`: If the column is sortable, an object containing:
    - `sorter`: function for [`useSorter`]()
    - `defaultDirection`: string for [`useSorter`]()
- `data`: An array of objects
- `defaultSort`: Name of the column to be used for initial sorting
- `defaultRange`: optional 2-length array containing the initial number indexes of the first and last items to be included in the initial "pagination" page

Returns an object containing:

- `columnDefs`: `columns` with default values applied to `header`, `getProps` and `RenderContent` where appropriate
- `allContent`: An array of "row" arrays, sorted by the current sorting selection, where each "row" array contains a props object for each "column" containing:
  - Each key returned by that column's `getProps` called on this row's `datum`
  - `rowIndex` number referring to the row's position in the `allContent` array
  - `columnIndex` number referring to the column definition's position in the array of column definitions
  - `columnName` matching the `name` string of this column
- `shownContent`: The slice of `allContent` falling in the current `range`. Note that `rowIndexes` are not changed so they continue to refer to the row's position in `allContent`, allowing a paginated row's original position to be known.
- `sortColumn`: string matching the name of the column the data is currently sorted by
- `setSortColumn( sortColumn:string )`: function from [`useState`]() updating the `sortColumn` and re-sorting the data
- `sortDirection`: string returned from [`useSorter`]()
- `setSortDirection`: function returned from [`useSorter`]()
- `rowCounts`: object containing metadata about the returned rows:
  - `total`: number of rows before applying `range`
  - `shown`: number of rows after applying `range`
  - `maxShown`: maximum number of rows that could be shown given the current `range`
  - `showFrom`: index number of the first row that the current `range` allows to be shown (`0` if no `range` is applied)
- `setRange`: function from [`useState`]() updating the current `range` resulting in new values for `shownContent` and `rowCounts`.
