# File Format

A command line tool can connect using the Websocket Protocol
to consume and record the data samples at a given interval in a known
file format that can be later used to process/interpret that data.
In order to delimit messages, each message will be prefixed with a checksum
for the message binary and its length, both in fixed unsigned 32-bit encoding.

Each data sample will be a Protocol Buffer Message, one at a time,
according to file format:

## File diagram:

| File offset ( bytes ) | Field             | Field Size    |
|:----------------------|------------------:|--------------:|
| 0                     | File Version      | 4             |
| 3                     | Message Checksum  | 4             |
| 7                     | Message Length    | 4             |
| 11                    | Message           | MessageSize   |
| ...                   | Message Checksum  | 4             |
| ...                   | Message Length    | 4             |
| ...                   | Message           | MessageSize   |

The file version number will be `1`, and we store it only for future
proofing this design.

Each message is prefixed with a checksum and then its length, each as 4 bytes.

The checksum is 32 bits generated using a hash of the message binary
with fnv1a32. It can be treated as a 32 bit number.

The maximum allowed chunk size is 4,294,967,295 bytes.

The message itself is then stored. Messages themselves that are received are of the proto type
`ProtocolDataPacket` which encodes messages of a specific type for future parsing and use.

This file format can be written and read in a streaming fashion, as each data dump
will have many messages which can generate a large amount of data over some period of time.

Due to the format of the introspection data emitting protocol, it is expected for a client
to connect to the server and immediately read and encode the static runtime metadata message
and the initial state message. Once the state is recorded the client will signal it is ready
for the next state. The receiving, encoding and signalling process for state messages is to
be repeated as long as the client stays connected.
