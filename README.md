# Yeah
Yet another event handler

## Static API

```js
var Mediator = require('yeah')
var ajax = require('ajax')

Mediator.on('template.ready', function (tmpl) {
	document.getElementById('los-el').innerHTML = tmpl
})

ajax('http://path.com/to/tmpl.html', function (err, response) {
	if (err) {
		Mediator.emit('template.failed', err)
	}
		
	if (response.text.length) {
		Mediator.emit('template.ready', response.text)
	}
})
```

### on | addListener

```js
var Mediator = require('yeah')
function event (arg) { alert(arg)}
Mediator.on('something', event)
Mediator.emit('something', 'Nayn') // alerts Nayn
```
### off | removeListener
  
```js
var Mediator = require('yeah')
function event () { alert('Hello') }
Mediator.on('something',event)
Mediator.off('something', event)
Mediator.emit('something') // no alert
```

### emit


## Mixin API

```js
var EventMixin = require('yeah/mixin')
var mediator = extend({}, EventMixin)
```

===
### #addEvent

#### Usage

##### `addEvent( 'name', fn } )`  
*{string}*  __name__ - The name of the event stack  
*{function}* __event__ - Unique event to be added to the __event stack__  
	
##### `addEvent( 'name', [fn1, fn2 /*, …*/ )`    
*{string}* __name__ - The name of the event stack  
*{array}* __stack__ - A list of functions to add to the __event stack__  

##### `addEvent( ['dom.ready','template.ready'], 'everythings.ready', fn )`
*{array}* __names__ - A list of event's that need to be fired before the compound event can fire  
*{string}* __name__ - The compound event's name  
*{function}* __event__ - The event to be added to the compound event's __event stack__

#### Examples

```js
var EventsMixin = require('yeah/mixin')
var mediator = extend({}, EventsMixin)
 
// add an event to an event key
mediator.addEvent('something', fn)
// add an array of events to one event key
mediator.addEvent('something', [
  function () {}, function () {}
])

// compound events: when 2+ events are fired, fire another
mediator.addEvent(['something','anotherthing'],'both.things', function oneThing() {})
// add more events to the compound event
mediator.addEvent('both.things', function letsAddAnother () {})
```

===
### #addEvents

===
### #removeEvent

===
### #fireEvent

===
### #hasFired

===
### #getEvents

