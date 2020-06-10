# Libp2p Observer Samples

These scripts simulate a libp2p network and generate data in libp2p Introspection protobuf format describing the activity of tht mock network.

## 1. Generating sample data

- `npm run mock` generates protobuf data for a time period and outputs it to `stdout`
- `npm run mock-file` is the same as `mock` but outputs to a file with a filename based on the current timestamp
- `npm run mock-sock` starts a mock data server on port 8080 and outputs protobuf messages to it in real tmie upon connection

### 1.1 Options

The above commands accept these arguments:

| argument | short | description | default |
|---|---|---|---|---|
| --connections | -c | Initial connections | `6` |
| --snapshot | -n | State messages every x milliseconds | `2000` |
| --peers | -p | At least x number of peers in the DHT | `30` |
| --streams | -s | Average number of streams per connection | 10 |
| --cutoff | -t | Number of seconds to keep old data | `120` |

These arguments apply only to generating mock stdout output or files, not mock websockets:

| argument | short | description | default |
|---|---|---|---|---|
| --duration | -d | Sample duration in seconds| `10` |
| --file | -f | Path to write file output | Use stdout |

### 1.2 Running commands from monorepo root

`npm run mock-file` and `npm run mock-sock` may be called from the monorepo root directory.

If running the commands from the monorepo root directory, pass the options after a `--`, for example:

```sh
npm run mock-sock -- -c 10 -s 5
```
```sh
npm run mock-file -- --duration 240
```

### 1.3 Connecting the UI to a mock websocket server

After running `npm run mock-sock` and running the demo app with `npm run start:app`, in the UI in the browser, open the "Websocket" bar and use the address and port the server is listening on in the catalogue to make a connection (usually the default, `ws://localhost:8080`).

## 2. Pre-defined samples

Pre-made data sets are provided in the `samples` folder. They can be loaded using the Sample data button in the UI and selecting one of the datasets.

These samples were created using the following commands:

- "sample-1min.mock" - `npm run mock-file -- --duration 60`
- "sample-2min.mock" - `npm run mock-file -- --duration 120`
- "sample-3min.mock" - `npm run mock-file -- --duration 180`
