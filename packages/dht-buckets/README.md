# `dht-buckets` @libp2p/observer-dht-buckets

A libp2p Observer widget, built on built on @nearform/observer-sdk, visualising peers on the libp2p Distributed Hash Tables and their activity in DHT queries.

[screenshot here]

## Key features

- Peers are represented as sqaures on a grid of grids representing the limited available "slots" in a Kademelia-based distrbuted hash table where a fixed number of peers can be stored for each Kademelia distance value.
- Peers can be tracked as they slide on or off the table and from the `0` "catch-all" bucket to specific buckets as the `0` bucket overflows
- Peers' "elevation" visualises relative time in the DHT, allowing older peers to be easily found.
- DHT queries are visualised in real time, as flashes of yellow entering (inbound) or blue exiting (outbound) the peer, with a fading glow representing the scale of recent inbound or outbound activity 
- Histograms give a more detailed view of DHT query activity per bucket and, if a peer is selected, per peer.

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
