# File Format

A command line tool can connect using the Websocket Protocol
to consume and record the data samples at a given interval in a known
file format that can be later used to process/interpret that data.
In order to delimit messages, each message will be prefixed with its length,
in fixed unsigned 32-bit encoding.

Each data sample will be a Protocol Buffer Message, one at a time,
according to file format:

## File diagram:

| File offset ( bytes ) | Field           | Field Size    |
|:----------------------|----------------:|--------------:|
| 0                     | File Version    | 4             |
| 3                     | Message Length  | 4             |
| 7                     | Message         | MessageSize   |
| ...                   | Message Length  | 4             |
| ...                   | Message         | MessageSize   |

The file version number will be `1`, and we store it only for future
proofing this design.
Each message is prefixed with its length as 4 bytes, and then we store the message
itself. The maximum allowed chunk size is 4,294,967,295 bytes.

This file format can be written and read in a streaming fashion, as each data dump
will have many messages which can generate a large amount of data over some period of time.
