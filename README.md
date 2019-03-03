## @hamgom95/eventemitter

Simple EventEmitter implementation.

### API Documentation

<a name="EventEmitter"></a>

#### EventEmitter
Event emitter.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| events | <code>Map</code> | Event listener map |


* [EventEmitter](#EventEmitter)
    * [.on(event, listener, opts)](#EventEmitter+on)
    * [.off([event], [listener])](#EventEmitter+off)
    * [.emit(event, ...args)](#EventEmitter+emit)

<a name="EventEmitter+on"></a>

##### eventEmitter.on(event, listener, opts)
Register event listener

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | Event name |
| listener | <code>function</code> | Listener callback |
| opts | <code>Object</code> | Options |
| opts.prepend | <code>boolean</code> | Whether to prepend listener |
| opts.once | <code>boolean</code> | Whether to use listener once only |

<a name="EventEmitter+off"></a>

##### eventEmitter.off([event], [listener])
Unregister listener.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| [event] | <code>string</code> | Event name. |
| [listener] | <code>function</code> | Same function that was registered. |

<a name="EventEmitter+emit"></a>

##### eventEmitter.emit(event, ...args)
Emit event with arguments.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | Event name. |
| ...args | <code>any</code> | Arguments to pass to listeners. |

