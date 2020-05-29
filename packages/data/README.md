# `data` @libp2p/observer-data

Helper functions to perform common operations on LibP2P Introspection data.

These functions are "vanilla" ES6+ JavaScript (with an ES5 webpack build available) and may therefore be imported and used in React components, in Node.js scripts and in tests alike. 

## Usage

An easy way to browse and experiment with the available functions is to:

- Run the LibP2P Observer demo app with `npm run start:app`
- Select a data sample from the UI menu
- Open browser developer tools
- Explore the functions on `window.libp2pObs.data`

Guidance is printed to the browser console on what data and other resources are available in the global scope.

## Exported functions by file

### binary.js

#### parseArrayBuffer( ArrayBuffer )

Decode LibP2P Introspection binary data that has been provided as an ArrayBuffer

#### parseBase64( string )

Decode LibP2P Introspection binary data that has been provided as a Base64 string.

#### parseBuffer( Buffer )

Decode LibP2P Introspection binary data that has been provided as a singular buffer.

#### parseBufferList( BufferList )

Decode LibP2P Introspection binary data that has been provided as a BufferList.

#### parseImport( any )

Decode LibP2P Introspection binary data of any supported type.

### connectionsList.js

#### getAllConnections( Array, { filter: function, latest: boolean } )

For an array of States, returns an array containing the earliest occurence of each connection that was at any point present.

If a `filter` function is passed, connections are passed to this function and excluded if it returns `false`. If `latest` is truthy, the latest rather than earliest occurence of each connection is returned.  

#### getAllStreamsAtTime( State )

Returns an array containing an object for each stream present in each connection in a state message, with keys `stream` for the stream data and `connection` for the connection the stream is attached to.

#### getConnections( State )

Returns an array of connections for a state, or an empty array if it is missing the `connectionsList` subsystem.

#### getMissingClosedConnections( State, Array )

For a State in an array of States, looks back at earlier States and returns an array of closed connections that are not included in the given State's connectionList.

#### getConnectionId( Connection )

Returns the id of a connection in string format, allowing comparison between ids using `===`.

#### getConnectionAge( Connection, State )

Returns a number for the number of miliseconds the connection was open in the given State. 

#### getConnectionTimeClosed( Connection, State )

Returns a number for the number of miliseconds the connection had been closed in the given State. 

#### getConnectionTraffic( Connection, direction:string, type:string )

Returns the cumulative traffic of a connection for a given direction ('in' or 'out') and data type ('bytes' or 'packets'). 

#### getStreams( Connection )

Returns an array of streams attached to the given Connection.

#### getStreamAge( Stream, State )

Returns a number for the number of miliseconds the stream was open in the given State. 

#### getStreamTimeClosed( Stream, State )

Returns a number for the number of miliseconds the stream had been closed in the given State. 

#### getStreamTraffic( Connection, direction:string, type:string )

Returns the cumulative traffic of a stream for a given direction ('in' or 'out') and data type ('bytes' or 'packets'). 
