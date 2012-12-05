# Yeah
Yet another event handler

### Static API

- #on | #addListener
  ```js
  var Mediator = require('yeah')
  function event (arg) { alert(arg)}
  Mediator.on('something', event)
  Mediator.emit('something', 'Nayn') // alerts Nayn
  ```
- #off | #removeListener
  ```js
  var Mediator = require('yeah')
  function event () { alert('Hello') }
  Mediator.on('something',event)
  Mediator.off('something', event)
  Mediator.emit('something') // no alert
  ```
- #emit


### Mixin API

- #getEvents
- #addEvent
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
- #addEvents
- #removeEvent
- #fireEvent
- #hasFired

