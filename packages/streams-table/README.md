# `streams-table` @libp2p/observer-streams-table

A libp2p Observer widget, built on built on @libp2p/observer-sdk, visualising current and recent data streams in libp2p Introspection data.

[screenshot here]

## Key features

- Note: currently data such as a stream's data traffic, latency and connection transport are unavailable to libp2p Introspection. This widget therefore currently has a limited feature set of basic data table functionality 

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
