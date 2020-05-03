# `samples`

These scripts simulate a LibP2P network and generate data in LibP2P Introspection protobuf format describing the activity of tht mock network.

## Usage

- `npm run mock` generates protobuf data for a time period and outputs it to `stdout`
- `npm run mock-file` is the same as `mock` but outputs to a file with a filename based on the current timestamp
- `npm run mock-sock` starts a mock data server on port 8080 and outputs protobuf messages to it in real tmie upon connection

`npm run mock-file` and `npm run mock-sock` may be called from the monorepo root directory.

### Options

The above commands accept these flags:

 - `--connections` (`-c`): Number of peers connected at initiation. Default: 6
 - `--streams` (`-s`): Average number of streams a connection has on connecting. Default: 10
 - `--peers` (`-p`): Number of peers in the DHT routing table on initiation. Default: 30
 - `--snapshot` (`-n`): Number of miliseconds represented by each state message. Default: 2000
 - `--cutoff` (`-t`): Number of seconds after which old data can be discarded. Default: 120  
 - `--file` (`-f`): (file only) Path for file output. Default: `mock-${Date.now()}`
 - `--duration` (`-d`) (file only): Number of seconds the mock network should be observed for. Default: 10

If running the commands from the monorepo root directory, pass the options after a `--`, for example:

```sh
npm run mock-sock -- -c 10 -s 5
``` 
```sh
npm run mock-file -- --duration 240
```

## Pre-defined samples

The `samples` directory contains example files generated with these commands:

- "sample-1min.mock" - `npm run mock-file -- --duration 60`
- "sample-2min.mock" - `npm run mock-file -- --duration 120`
- "sample-3min.mock" - `npm run mock-file -- --duration 180`
