# `events-table` @libp2p/observer-events-table

A libp2p Observer widget, built on built on @nearform/observer-sdk, visualising recent events observed on a libp2p Introspection server in a table that responds to observed event types.

[screenshot here]

## Key features

- Events are represented as rows in a table, sorted by recency by default, and update in real time as events are observed on a live connection
- To aid interacting with a fast-changing table, updates to the table can be paused using a 'pause' button or on mouseover of any row, while a number displays how many events have been observed since pause
- The schema of the table is based on metadata provided by the server in runtime messages. If new events are observed, the user is given the option of updating the table schema
- Specific table rows representing specific fields in the events data can be toggled on and off by the user to give a more focussed or broad view 
- Known data types such as JSON, peer IDs and date stamps are presented in a human-readable, machine-sortable way.

## Exports

Exports follow the standard format of libp2p Observer widgets:

#### `Widget({ closeWidget })` 

 - `closeWidget` (optional): function to close this widget, usually provided automatically by [@libp2p/observer-shell](../shell)

React component rendering this widget. Expects to be rendered inside `ThemeSetter` and `DataProvider` contexts from [@libp2p/observer-sdk](../sdk). These are usually provided by [@libp2p/observer-catalogue](../catalogue) or [@libp2p/observer-testing]](../testing).

#### description

String in plain text or markdown format, describing this widget. 

#### name

String containging this widget's name.

#### screenshot

PNG image displaying a thumbnail image of this widget. Importing packages should have an appropriate webpack loader for handling images.

#### tags

Array of strings listing topics this widget relates to.
