# `data` @libp2p/observer-data

Helper functions to perform common operations on LibP2P Introspection data.

These functions are "vanilla" ES6+ JavaScript (with an ES5 webpack build available) and may therefore be imported and used in React components, in Node.js scripts and in tests alike. 

<!-- MarkdownTOC -->

- [Usage](#usage)
- [Exported functions by file](#exported-functions-by-file)
  - [binary.js](#binaryjs)
    - [parseArrayBuffer\( ArrayBuffer \)](#parsearraybuffer-arraybuffer-)
    - [parseBase64\( string \)](#parsebase64-string-)
    - [parseBuffer\( Buffer \)](#parsebuffer-buffer-)
    - [parseBufferList\( BufferList \)](#parsebufferlist-bufferlist-)
    - [parseImport\( any \)](#parseimport-any-)
  - [connectionsList.js](#connectionslistjs)
    - [getAllConnections\( Array, { filter: function, latest: boolean } \)](#getallconnections-array--filter-function-latest-boolean--)
    - [getAllStreamsAtTime\( State \)](#getallstreamsattime-state-)
    - [getConnections\( State \)](#getconnections-state-)
    - [getMissingClosedConnections\( State, Array \)](#getmissingclosedconnections-state-array-)
    - [getConnectionId\( Connection \)](#getconnectionid-connection-)
    - [getConnectionAge\( Connection, State \)](#getconnectionage-connection-state-)
    - [getConnectionTimeClosed\( Connection, State \)](#getconnectiontimeclosed-connection-state-)
    - [getConnectionTraffic\( Connection, direction:string, type:string \)](#getconnectiontraffic-connection-directionstring-typestring-)
    - [getStreams\( Connection \)](#getstreams-connection-)
    - [getStreamAge\( Stream, State \)](#getstreamage-stream-state-)
    - [getStreamTimeClosed\( Stream, State \)](#getstreamtimeclosed-stream-state-)
    - [getStreamTraffic\( Connection, direction:string, type:string \)](#getstreamtraffic-connection-directionstring-typestring-)

<!-- /MarkdownTOC -->


<a id="usage"></a>
## Usage

An easy way to browse and experiment with the available functions is to:

- Run the LibP2P Observer demo app with `npm run start:app`
- Select a data sample from the UI menu
- Open browser developer tools
- Explore the functions on `window.libp2pObs.data`

Guidance is printed to the browser console on what data and other resources are available in the global scope.

<a id="exported-functions-by-file"></a>
## Exported functions by file

<a id="binaryjs"></a>
### [binary.js](lib/binary.js)

<a id="parsearraybuffer-arraybuffer-"></a>
#### parseArrayBuffer( ArrayBuffer )

Decode LibP2P Introspection binary data that has been provided as an ArrayBuffer

<a id="parsebase64-string-"></a>
#### parseBase64( string )

Decode LibP2P Introspection binary data that has been provided as a Base64 string.

<a id="parsebuffer-buffer-"></a>
#### parseBuffer( Buffer )

Decode LibP2P Introspection binary data that has been provided as a singular buffer.

<a id="parsebufferlist-bufferlist-"></a>
#### parseBufferList( BufferList )

Decode LibP2P Introspection binary data that has been provided as a BufferList.

<a id="parseimport-any-"></a>
#### parseImport( any )

Decode LibP2P Introspection binary data of any supported type.

<a id="connectionslistjs"></a>
### [connectionsList.js](lib/connectionsList.js)

<a id="getallconnections-array--filter-function-latest-boolean--"></a>
#### getAllConnections( Array, { filter: function, latest: boolean } )

For an array of States, returns an array containing the earliest occurence of each connection that was at any point present.

If a `filter` function is passed, connections are passed to this function and excluded if it returns `false`. If `latest` is truthy, the latest rather than earliest occurence of each connection is returned.  

<a id="getallstreamsattime-state-"></a>
#### getAllStreamsAtTime( State )

Returns an array containing an object for each stream present in each connection in a state message, with keys `stream` for the stream data and `connection` for the connection the stream is attached to.

<a id="getconnections-state-"></a>
#### getConnections( State )

Returns an array of connections for a state, or an empty array if it is missing the `connectionsList` subsystem.

<a id="getmissingclosedconnections-state-array-"></a>
#### getMissingClosedConnections( State, Array )

For a State in an array of States, looks back at earlier States and returns an array of closed connections that are not included in the given State's connectionList.

<a id="getconnectionid-connection-"></a>
#### getConnectionId( Connection )

Returns the id of a connection in string format, allowing comparison between ids using `===`.

<a id="getconnectionage-connection-state-"></a>
#### getConnectionAge( Connection, State )

Returns a number for the number of miliseconds the connection was open in the given State. 

<a id="getconnectiontimeclosed-connection-state-"></a>
#### getConnectionTimeClosed( Connection, State )

Returns a number for the number of miliseconds the connection had been closed in the given State. 

<a id="getconnectiontraffic-connection-directionstring-typestring-"></a>
#### getConnectionTraffic( Connection, direction:string, type:string )

Returns the cumulative traffic of a connection for a given direction ('in' or 'out') and data type ('bytes' or 'packets'). 

<a id="getstreams-connection-"></a>
#### getStreams( Connection )

Returns an array of streams attached to the given Connection.

<a id="getstreamage-stream-state-"></a>
#### getStreamAge( Stream, State )

Returns a number for the number of miliseconds the stream was open in the given State. 

<a id="getstreamtimeclosed-stream-state-"></a>
#### getStreamTimeClosed( Stream, State )

Returns a number for the number of miliseconds the stream had been closed in the given State. 

<a id="getstreamtraffic-connection-directionstring-typestring-"></a>
#### getStreamTraffic( Connection, direction:string, type:string )

Returns the cumulative traffic of a stream for a given direction ('in' or 'out') and data type ('bytes' or 'packets'). 
