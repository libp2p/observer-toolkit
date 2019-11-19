# Introspection Data Emitting Protocol

There has been previous work and discussions which inform the protocol for introspection data emitting.
The existing understanding of the protocol is outlied below.

When the client starts up, it will look for the local introspection port of the LibP2P network.
There will also be an option to connect to another host.
Once connected, the introspection module will start extracting data defined in the introspection protobuf from other LibP2P modules such as swarm, or other source providers.

The protocol is based on the premise of the server who is providing data is an "emitter".
The client which connects to the server can then treat the data it provides much like an "event emitter", or pub-sub data source.
The "emitter" emits data from several sources, each data message received on the client can be treated like an "event".
The emitter should only send data to the client when the client has expressed interest via a signal for an event/data.
Clients can either signal interest in a pull based single event provided by the server (siimilar to using an event emitter "once" construct), or they can signal interest in a push based many events being sent to them indefinitely by the server (similar to using an event emitter "on" construct)

Generally the client listens for the data message from the WebSocket connection and once received and processed for visualization will request for the next data set.
This process will take away the backpressure resposibilty from the server for snapshot emitting.

## Diagram

The specific functionality of the sequence of events for the state snapshot fetching is described in the sequence diagram, below.

![Sequence diagram of protocol](./images/introspection-sequence-diagram.png "Sequence diagram of state snapshot fetching")

The specific functionality of the sequence of events for the push emitter data is described in the sequence diagram, below.

![Sequence diagram of protocol](./images/introspection-sequence-diagram.png "Sequence diagram of push emitter data sending")

## Specifics of protocol operation

The UI client interacts via a WebSocket connection to the introspection server.
There is no need to add a checksum over the live connection communication as the WebSocket connection (and underlying TCP transport) will ensure only valid data is processed.
All communication should be via protobuf messages.
When the WebSocket connects the server will send the client the static metadata for the node it has connected to and a current snapshot from the introspection node.
Whenever any snapshot has been received, parsed, and stored in the UI datastore, the UI will send a message over the WebSocket connection to signal it is ready for the next snapshot.

The protobuf messages sent from the server to the clients is quite simple.
It contains a `version` and a `message` property, which is defined as a `oneof` type correlating to the expected data sources to be sent, such as `State` snapshots, static `Runtime` information, etc.

The content of this signal message is specified in the relevant protobuf file.
It is a protobuf that specifies a request for a specific piece of data or a request to change the mode of operation, to signal interest in a change of operation with subscribing to, unsubscribing from, pausing and unpausing push emitters.
This protobuf defines the `version` of the protobuf message, the `signal` enum, and a correlated `data_source` for the signal.

These push emitters can be defined by extending the data_source. 

Example usecases of signals from the client and their suggested protobuf content might be the following:

- to request the next snapshot. (`signal = SEND_DATA, data_source = STATE`)
- to request the static metadata be sent again. (`signal = SEND_DATA, data_source = RUNTIME`)
- to request a new type of data such as trace data be sent to the client through a push emitter. (`signal = START_PUSH_EMITTER, data_source = TRACE`)
- to request a push emitter is paused to handle backpressure concerns. (`signal = PAUSE_PUSH_EMITTER, data_source = TRACE`)

When the server receives a signal from the client to send the next snapshot it will then be able to send the next snapshot.
The server should operate to send any snapshot only once even if the client signals it is ready before the next snapshot is generated.
The server should not send snapshots if the client has not signaled it is ready to receive one.

This makes the data sending protocol a pull-based protocol, which eliminates backpressure concerns.
It can be considered that all requests for specific data and the response is a pull-based protocol.
This includes the snapshot sending flow of data.

The protocol also allows a signal to subscribe to push emitters, or to unsubscribe from them.
Clients that implement this must deal with backpressure and be able to pause/unpause emitters as needed.
An emitter pause message can also be sent over the connection to allow a temporary buffer period.
An unpause message then can be sent when ready for more data.
If there is no push emitter operating for the client, pausing, unpausing and unsubscribing will cause no change in operation.
If the emitter is already paused, sending another pause should have no direct affect.
If the emitter is sending data then an unpause signal should also have no direct affect.
It is up to the server implementation to handle the specifics of buffering/queuing further data to be sent during a pause period of the push emitter.
