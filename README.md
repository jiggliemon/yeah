# Yeah
Yeah stands for: Yet another event handler;

### Static API

#### Methods:  
- [on | addListener](#on--addlistener)
- [off | removeListener](#off--removelistener)
- [removeEvent](#removeevent)
- [fireEvent](#fireevent)
- [hasFired](#hasfired)
- [getEvents](#getevents)

#### Example:  
```
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
===
### #on | #addListener

```
var Mediator = require('yeah')
function event (arg) { alert(arg)}
Mediator.on('something', event)
Mediator.emit('something', 'Nayn') // alerts Nayn
```
===
### #off | #removeListener
  
```
var Mediator = require('yeah')
function event () { alert('Hello') }
Mediator.on('something',event)
Mediator.off('something', event)
Mediator.emit('something') // no alert
```
===
### emit


## Mixin API

#### Methods:
- [addEvent](#addevent)
- [addEvents](#addevents)
- [removeEvent](#removeevent)
- [fireEvent](#fireevent)
- [hasFired](#hasfired)
- [getEvents](#getevents)


#### Example:
```
var EventMixin = require('yeah/mixin')
var mediator = extend({}, EventMixin)
```

===
### #addEvent

#### Arguments:
__Standard:__  `addEvent( 'name', fn )`  
*{string}*  __name__ : The name of the event stack  
*{function}* __event__ : Unique event to be added to the __event stack__  
	
__Event List:__ `addEvent( 'name', [fn1, fn2 /*, …*/] )`    
*{string}* __name__ : The name of the event stack  
*{array}* __stack__ : A list of functions to add to the __event stack__  

__Compound Events:__ `addEvent( ['dom.ready','template.ready'], 'everythings.ready', fn )`  
*{array}* __names__ : A list of event's that need to be fired before the compound event can fire  
*{string}* __name__ : The compound event's name  
*{function}* __event__ (optional): The event to be added to the compound event's __event stack__

#### Examples:
```
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

A convenience method for adding multiple event stacks at a time.

#### Arguments:
`instance.addEvents({key: fn, anotherKey: anotherFn })`  
*{object}* __hash__ : key/value object where `key` is the event name, and `value` is a function or array of functions  

#### Example:
```
instance.addEvents({
	'model.ready': function (model) {
		model.get('/path', function (response) {
			instance.fireEvent('data.got', response.text)
		})
	},
	'data.got': [
		function (text) {
			if (text.indexOf('dog')) {
				// do something for dogs
			}
		},
		function (text) {
			if (text.indexOf('cat')) {
				// do something for cats
			}
		}
	]
})
```

===
### #removeEvent

===
### #fireEvent

#### Arguments:

#### Example:
```
var EventMixin = require('yeah/mixin')
var instance = extend({}, EventMixin)
var wachooSay = []

function say (what) {
	alert(what)
}

instance.addEvent('say.hello', [
	function () {wachooSay = []},
	function () {wachooSay.push("Hello")},
	function () {wachooSay.concat(Array.prototype.slice.call(arguments)) },
	function () { say(wachooSay.join(' ')) }
])

instance.fireEvent('say.hello', "Jiggliemon") // will alert `Hello Jiggliemon`
instance.fireEvent('say.hello:latched', "Visitor", ":)") // will alert `Hello Visitor :)`
instance.fireEvent('say.hello', "Goodbye") // won't do anything
```

===
### #hasFired

===
### #getEvents

