var assert = require('assert')
var EventMixin = require('../src/mixin')

function extend (foo,baz) {
  for(var key in baz) {
    if(baz.hasOwnProperty(key)) {
      foo[key] = baz[key]
    }
  }
  return foo
}

describe('EventMixin', function () {
  var Mediator

  function fired () {
    fired.count++
  }
  fired.count = 0

  beforeEach(function () {
    Mediator = extend({},EventMixin)
    fired.count = 0
  })

  describe('#addEvent', function () {


    it("should add a unique function to the event stack when the 1st argument is a string & 2nd is fn", function () {
      Mediator.addEvent('key', function (argument) {
        console.log(argument)
      })
      assert.equal(1, Mediator.getEvents('key').length)
    })

    it("should only add unique functions to the event stack", function () {
      function fn () {}
      Mediator.addEvent('key', fn)
      Mediator.addEvent('key', fn)
      assert.equal(1, Mediator.getEvents('key').length)
    })

    it("should add multiple unique function to the event stack when an array of functions is passed as the second argument", function () {
      Mediator.addEvent('key', [
        function () {}, function () {}
      ])
      assert.equal(2, Mediator.getEvents('key').length)
    })

    it("should add a compound event if the first argument is an array and the second is an event name", function () {
      Mediator.addEvent(['one','two'], 'compounded', function() {})
      assert.equal(1, Mediator.getEvents('compounded').length)
    })
  })

  describe('#addEvents', function () {
    it("should add multiple events when an event hash is passed as the 1st argument", function () {
      Mediator.addEvents({
        key:function () {},
        anotherKey: function () {}
      })

      assert.equal(1, Mediator.getEvents('key').length)
      assert.equal(1, Mediator.getEvents('anotherKey').length)
    })
  })

  describe('#fireEvent', function () {
    it('should execute the full stack of events', function () {
      Mediator.addEvent('something', [
         function (arg) {fired()}
        ,function (arg) {fired()}
        ,function (arg) {fired()}
      ])


      Mediator.fireEvent('something')
      assert.equal(fired.count,3)
    })

    it('should execute the remainder of the event stack if an error occurs', function () {
      Mediator.addEvent('something', [
         function (arg) {fired()}
        ,function (arg) { rogueVariable; fired()}
        ,function (arg) {fired()}
      ])

      Mediator.fireEvent('something')
      assert.equal(fired.count,2)
    })

    it("should fire a compound event after it's dependent events have been executed", function () {

      Mediator.addEvent(['ready','go'], "ready.go", fired)

      Mediator.fireEvent('ready')
      Mediator.fireEvent('go')

      assert.equal(1, fired.count)
    })

    it("should immediatly fire events that are attempted to be added to a fired latched event", function () {
      function fired () {
        fired.count++
      }
      fired.count = 0

      Mediator.addEvent("some", fired)
      Mediator.fireEvent("some:latched")
      Mediator.addEvent("some",fired)

      assert.equal(2, fired.count)
    })

    it("should only fire through a :latched event stack once", function () {
      Mediator.addEvent("some", fired)
      Mediator.fireEvent("some:latched")
      Mediator.fireEvent("some")
      Mediator.fireEvent("some:latched")
      assert.equal(1, fired.count)
    })

    it("should only fire a latched event once", function () {
      Mediator.addEvent('something', function () {
        fired()
      })
      Mediator.fireEvent('something:latched')
      Mediator.fireEvent('something')

      assert.equal(1, fired.count)
    })

  })

  describe('#callMeMaybe', function () {
    it('should return a constructed function that will fire an event', function () {
      Mediator.addEvent("fire", fired)
      Mediator.addEvent("call", Mediator.callMeMaybe("fire"))
      Mediator.fireEvent("call")
      Mediator.fireEvent("call")
      assert.equal(2, fired.count)
    })
  })

})