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
  - [dht.js](#dhtjs)
  - [enums.js](#enumsjs)
    - [getEnumByName\( name:string, Object \)](#getenumbyname-namestring-object-)
    - [dhtStatusNames](#dhtstatusnames)
    - [statusNames](#statusnames)
    - [roleNames](#rolenames)
    - [transportNames](#transportnames)
    - [dhtQueryResultNames](#dhtqueryresultnames)
    - [dhtQueryDirectionNames](#dhtquerydirectionnames)
    - [dhtQueryEventNames](#dhtqueryeventnames)
  - [events.js](#eventsjs)
    - [getEventType\( Event \)](#geteventtype-event-)
    - [getEventPropertyLookup\( EventType \)](#geteventpropertylookup-eventtype-)
    - [getEventTypeWithProperties \({ eventType:Object, propertyTypeLookup: Object }\)](#geteventtypewithproperties--eventtypeobject-propertytypelookup-object-)
  - [runtime.js](#runtimejs)
    - [getRuntimeEventTypes\( Runtime \)](#getruntimeeventtypes-runtime-)
    - [getRuntimeEventProperties\( Runtime \)](#getruntimeeventproperties-runtime-)
  - [states.js](#statesjs)
    - [getLatestState\( Array \)](#getlateststate-array-)
    - [getSubsystems\( State \)](#getsubsystems-state-)
    - [getStateIndex\( Array, number \)](#getstateindex-array-number-)
    - [getStateRangeTimes\( Array \)](#getstaterangetimes-array-)
    - [getStateTimes\( State \)](#getstatetimes-state-)

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

<a id="dhtjs"></a>
### [dht.js](lib/dht.js)

The DHT implementation and related introspection data model is currently in flux, so the DHT functions here should be considered unstable until this upstream work is complete.

<a id="enumsjs"></a>
### [enums.js](lib/enums.js)

<a id="getenumbyname-namestring-object-"></a>
#### getEnumByName( name:string, Object )

Returns the number corresponding to the given name in the provided Object.

<a id="dhtstatusnames"></a>
#### dhtStatusNames
<a id="statusnames"></a>
#### statusNames
<a id="rolenames"></a>
#### roleNames
<a id="transportnames"></a>
#### transportNames
<a id="dhtqueryresultnames"></a>
#### dhtQueryResultNames
<a id="dhtquerydirectionnames"></a>
#### dhtQueryDirectionNames
<a id="dhtqueryeventnames"></a>
#### dhtQueryEventNames

Objects inumerating the given names as per the protobuf definition given in [@libp2p/observer-proto](../proto)

<a id="eventsjs"></a>
### [events.js](lib/events.js)

<a id="geteventtype-event-"></a>
#### getEventType( Event )

Returns a string of the event's event type name.

<a id="geteventpropertylookup-eventtype-"></a>
#### getEventPropertyLookup( EventType )

For an EventType message object, returns an object enumerating property types defined in the protobuf, with numeric keys and string values.

<a id="geteventtypewithproperties--eventtypeobject-propertytypelookup-object-"></a>
#### getEventTypeWithProperties ({ eventType:Object, propertyTypeLookup: Object })

Returns an array containing an object for each property type of an eventType, with the `name` and `type` as strings and a boolean value `hasMultiple` true if the property can have more than one vlue per event.

<a id="runtimejs"></a>
### [runtime.js](lib/runtime.js)

<a id="getruntimeeventtypes-runtime-"></a>
#### getRuntimeEventTypes( Runtime )

Returns an array of objects containing the name and properties (as expanded by `getEventTypeWithProperties`) of each event type defined in the provided runtime; or an empty array if no runtime is present.

<a id="getruntimeeventproperties-runtime-"></a>
#### getRuntimeEventProperties( Runtime )

Returns an array of all event properties in all event types in a runtime (as expanded by `getEventTypeWithProperties`), or an empty array if no runtime is present.

<a id="statesjs"></a>
### [states.js](lib/states.js)

<a id="getlateststate-array-"></a>
#### getLatestState( Array ) 

For a sorted array of states, returns the most recent, or null if the array is empty.

<a id="getsubsystems-state-"></a>
#### getSubsystems( State )

Returns the subsystems of a state, such as `connectionList` and `dht`, or `null` if no state is available.

<a id="getstateindex-array-number-"></a>
#### getStateIndex( Array, number )

For an array of states and numeric timestamp, returns the index number of the state that has the given timestamp as its "end" time.

<a id="getstaterangetimes-array-"></a>
#### getStateRangeTimes( Array )

For an array of states, returns an object with the `start` and `end` timestamps of the earliest and latest State messages, and a `duration` value for the number miliseconds between these two points; or all values as 0 if the array is empty. 

<a id="getstatetimes-state-"></a>
#### getStateTimes( State )

Returns an object with the `start` and `end` timestamps of the State message, and a `duration` value for the number of miliseconds spanned by the State message.
