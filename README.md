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
===
### #on | #addListener

```js
var Mediator = require('yeah')
function event (arg) { alert(arg)}
Mediator.on('something', event)
Mediator.emit('something', 'Nayn') // alerts Nayn
```
===
### #off | #removeListener
  
```js
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
```js
var EventMixin = require('yeah/mixin')
var mediator = extend({}, EventMixin)
```

===
### #addEvent

#### Arguments:
###### __Standard__ 
1. *{string}*  __name__ : The name of the event stack  
2. *{function}* __event__ : Unique event to be added to the __event stack__  

 ```js
 addEvent( 'name', fn )
 ```  
	
###### __Add Event List__   
1. *{string}* __name__ : The name of the event stack  
2. *{array}* __stack__ : A list of functions to add to the __event stack__  

```js
addEvent( 'name', [fn1, fn2 /*, …*/] )
```    

###### __Create Compound Event__ 
1. *{array}* __names__ : A list of event's that need to be fired before the compound event can fire  
2. *{string}* __name__ : The compound event's name  
3. *{function}* __event__ (optional): The event to be added to the compound event's __event stack__

```js
addEvent( ['dom.ready','template.ready'], 'everythings.ready', fn )
```

#### Examples:
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

A convenience method for adding multiple event stacks at a time.

#### Arguments:
###### __Standard__
1. *{object}* __hash__ : key/value object where `key` is the event name, and `value` is a function or array of functions  

```js
instance.addEvents({key: fn, anotherKey: anotherFn })
```

#### Example:
```js
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
###### __Standard__
1. *{string}* __name__ : The event identifer
2. *{arguments}* __arguments__ (optional) : Every subsequent argument will be passed into  the fired events

```js
instance.fireEvent('name'  /*, arg1, arg2, … */)
```

###### Latched Events
1. *{string}* '__name__' + ':latched' : An event stack identifier with a concatenated `:latched` 
2. *{arguments}* __arguments__ : The arguments work the same as with the standard firing

A latched event is one that once fired, remains active for the remainder of the application. Once fired,   Subsequent attempts to add a function to a latched event's event stack will result in the function being fired immedatly. 

An example of a native "latched" event would be the `DOMContentLoaded` event. Once the DOM Content has loaded, it will forever be loaded. 

```js
instance.fireEvent('name:latched'  /*, arg1, arg2, …*/)
```

#### Example:
```js
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

// Firing with the standard method
instance.fireEvent('say.hello', "Jiggliemon") // will alert `Hello Jiggliemon`
instance.fireEvent('say.hello', "Friends") // will alert `Hello Friends`

// Firing with the `:latched` identifier
instance.fireEvent('say.hello:latched', "Visitor", ":)") // will alert `Hello Visitor :)`
instance.fireEvent('say.hello', "Goodbye") 
instance.addEvent('say.hello', function () {
	alert('Simple Hello')
}) // will alert `Simple Hello` immediatly
```

===
### #hasFired

#### Arguments:
###### __Standard__
1. *{string}* __name__ : Event stack identifer

```js
instance.hasFired('name')
```

#### Example:
```js
instance.addEvent('smile', function () {
	alert(':)')
})
instance.hasFired('smile') // false
instance.fireEvent('smile') // alerts `smile
instance.hasFired('smile') // true
```
===
### #getEvents

#### Arguments:
###### __Standard__
1. *{string}* __name__ : Event stack identifer

```js
instance.getEvents('name')
```

#### Example:
```js
var fn = function () {
	alert(':)')
}
instance.addEvent('smile',fn)

instance.getEvents('smile') // false
instance.getEvents('smile') // [fn] returns an array of the functions in the event stack
```

