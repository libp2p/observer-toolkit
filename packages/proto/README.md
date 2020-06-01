# `proto` @libp2p/observer-proto

This package contains [the `.proto` protobuf schema](lib/introspection.proto) shared with the LibP2P Introspection module, and the [JavaScript implementation](lib/introspection.proto) of this schema generated with ProtoC, as well as a checksum script, [fnv1a](lib/fnv1a.js) for verifying LibP2P Introspection binary.

For more details on the protobuf format and operation, see the [official Google protobuf documentation](https://developers.google.com/protocol-buffers).

## Usage

### Using protobuf messages in JavaScript

Decoded protobuf objects in JavaScript convert field names in the protobuf schema to camelCase `get` and `set` methods. For example, a field named `version` would be accessed by calling `.getVersion()` on the decoded JavaScript protobuf message.

To explore the message format, view the [LibP2P Introspection protobuf schema](lib/introspection.proto), or use the [Console API in an app build](../../docs/developer-guide.md#23-accessing-data-in-the-browser-console) to explore sample protobuf messages in the browser console.

### Updating the protobuf schema

In the rare event of needing to update the protobuf definition and generated JavaScript implementation, run `npm run protoc` (requires [`protoc`](http://google.github.io/proto-lens/installing-protoc.html)). Ensure that changes are versioned and also mirrored in the LibP2P Introspection module.
