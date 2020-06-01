# `shell`

This package exports components allowing the deployment of a UI containing data controls, widget filters and an interactive timeline wrapping around and controlling a LibP2P Observer widget.

## Exported API

#### `DataPanel()`

A context-driven component needing no props listing buttons showing and allowing changes to the currently loaded data:

 - `DataTypeControl` shows the current data `source` from `SourceContext` and allows different data to be loaded or a live websocket connection to be paused.
 - `GlobalFilterControl` shows how many global filters are currently active and allows these to be set and unset.
 - `FileDownload` allows the current dataset shared by `DataProvider` to be exported as a binary file and shows the size of that file
 - Peer Id of the current runtime message is shown and can be copied to the clipboard
 - `RuntimeInfo` shows system info about the system supplying the LibP2P Introspection data and allows signals to be sent changing runtime settings.

#### `DataTray({ handleNewData })`

A component showing any currently selected data and allowing new sample, file or websocket-based data to be selected and loaded.

`handleNewData` prop is an optional callback function called without arguments when a new data source has been loaded.

 - `DataTrayItem` wraps an individual type of data source in animated controls
 - `SamplesList` provides a UI for choosing pre-made sample data
 - `UploadDataButton` provides a UI for choosing or drag-and-dropping a binary data file to upload
 - `WebSocketInput` provides a UI for entering and connecting to a websocket URL

#### `Timeline({ width, leftGutter })`

A visualisation of states data dispatched by `DataProvider` showing data in and data out over time, combined with a slider control for selecting a current state and filtering widgets to show only data before the selected state.

 - `TimelintPaths` draws an SVG area chart
 - `TimeSlider` restyles the SDK slider component
 - `TimeTicks` labels the timeline's X axis
 - `DataTicks` labels the timeline's Y axis

#### `WidgetHeader({ name, description, closeWidget })`

A common header for open LibP2P Introspection widgets, including name, expandable description, close icon and filter controls.

 - `FiltersButton` displays how many filters are active and toggles the visibility of the `FiltersTray`
 - `FiltersTray` displays available filters for this widget

#### `ActiveWidget`

A styled wrapper for `WidgetHeader` and the accompanying widget.

#### `ControlPanel`

A styled wrapper for the `DataPanel`, `DataTray` and `Timeline`.