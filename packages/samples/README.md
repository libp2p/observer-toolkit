# Libp2p Observer Samples

This package contains some samples to help you get started with the Libp2p Observer.

## Pre-made data sets

Pre-made data sets are provided in the `samples` folder. They can be loaded using the Sample data button in the UI and selecting one of the datasets.

## Custom data sets

Just like the pre-made samples, it's possible to create your own dataset. Create a new dataset with `npm run mock-file`. This creates a new mock data file with some default settings that you can change from the command line arguments.

| argument | description | default|
|---|---|---|---|---|
| -c | Initial connections | 6 |
| -d | Sample duration in seconds| 10 |
| -n | State messages every x milliseconds | 2000 |
| -p | At least x number of peers in the DHT | 30 |
| -s | Average number of streams per connection | 10 |
| -t | Number of seconds to keep old data | 120 |

## Websocket server

A websocket server can be started to mock live introspection data streaming into the catalogue.

- start the websocket server with `npm run mock-sock`
- use the address and port the server is listening on in the catalogue to make a connection (i.e. `ws://localhost:8080`)
