# Introspection Data Streaming Protocol

There has been previous work and discussions which inform the protocol for introspection data streaming.
The existing understanding of the protocol is outlied below.

When the client starts up, it will look for the local introspection port of the LibP2P network.
There will also be an option to connect to another host.
Once connected, the introspection module will start extracting data defined in the introspection protobuf from other LibP2P modules such as swarm, or other source providers.

Generally the client listens for the data message from the WebSocket connection and once received and processed for visualization will request for the next data set.
This process will take away the backpressure resposibilty from the server for snapshot streaming.

## Diagram

The specific functionality of this sequence of events is described in the sequence diagram, below.

![Sequence diagram of protocol](./images/introspection-sequence-diagram.png "Sequence diagram")

## Specifics of protocol operation

The UI client interacts via a WebSocket connection to the introspection server.
All communication should be via protobuf messages.
When the WebSocket connects the server will send the client the static metadata for the node it has connected to and a current snapshot from the introspection node.
Whenever any snapshot has been received, parsed, and stored in the UI datastore, the UI will send a message over the WebSocket connection to signal it is ready for the next snapshot.

The content of this signal message is specified in the relevant protobuf file.
It is a protobuf that specifies a request for a specific piece of data or a request to change the mode of operation, to signal interest in a change of operation with subscribing to, unsubscribing from, pausing and unpausing push streams.

These push streams are to be defined. 

Examples of communication from the client might be:

- to request the next snapshot.
- to request the static metadata be sent again.
- to request a new stream of data such as trace data be sent to the client through a push stream.
- to request a push stream is paused to handle backpressure concerns.

When the server receives a signal from the client to send the next snapshot it will then be able to send the next snapshot.
The server should operate to send any snapshot only once even if the client signals it is ready before the next snapshot is generated.
The server should not send snapshots if the client has not signaled it is ready to receive one.

This makes the data sending protocol a pull-based protocol, which eliminates backpressure concerns.
It can be considered that all requests for specific data and the response is a pull-based protocol.
This includes the snapshot sending flow of data.

The protocol also allows a signal to subscribe to push streams, or to unsubscribe from them.
Clients that implement this must deal with backpressure and be able to pause/unpause streams as needed.
A stream pause message can also be sent over the connection to allow a temporary buffer period.
An unpause message then can be sent when ready for more data.
If there is no push stream operating for the client, pausing, unpausing and unsubscribing will cause no change in operation.
if the stream is already paused, sending another pause should have no direct affect.
If the stream is sending data then an unpause signal should also have no direct affect.
It is up to the server implementation to handle the specifics of buffering/queuing further data to be sent during a pause period of the push stream.
