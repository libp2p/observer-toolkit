# Pull Based introspection snapshot streaming.

There has been previous work and discussions which inform the pull-based protocol for snapshot data streaming. The existing understanding of the protocol is outlied below.

When the client starts up, it will look for the local introspection port of the LibP2P network. There will also be an option to connect to another host.  Once connected, the introspection module will start extracting the data defined in introspection message from other LibP2P modules such as swarm.

The client listens for the data message from the WebSocket connection and once received and processed for visualization will request for the next data set. This process will take away the backpressure resposibilty from the server.

## Diagram

The specific functionality of this sequence of events is described in the sequence diagram, below.

![Sequence diagram of protocol](./images/introspection-sequence-diagram.png "Sequence diagram")

## Specifics of protocol operation

The UI client interacts via a WebSocket connection to the introspection server. When the WebSocket connects the server will send the client the current snapshot from the introspection node as a well formed protobuf message. Whenever any snapshot has been received, parsed, and stored in the UI datastore, the UI will send a message over the WebSocket connection to signal it is ready for the next snapshot.

The content of this message is currently unspecified, and it could be used in the future for sending some control information about the next sample. The format of these messages should be kept to as small as possible.
While developing the protocol sending simple strings should be good to use for operation to begin to crystalise the requirements of the format. This can then be formalised within a protobuf when it has been discovered the concrete needs of the protocol.

When the server receives the ready signal from the client it will then be able to send the next snapshot. The server should operate to send any snapshot only once even if the client signals it is ready before the next snapshot is generated. The server should not send snapshots if the client has not signaled it is ready to receive one. 

This makes the snapshot sending protocol a pull-based protocol, which eliminates backpressure concerns.
