var assert = require('assert')
var Mediator = require('../src/index')

describe('Yeah', function () {
  it("should append the mixin methods to the first argument if called like a function", function () {
    var SomeObj = {}
    Mediator(SomeObj)
    assert(typeof SomeObj.addEvent, 'function')
  })

  it("should return a new object with the mixin for a prototype", function () {
    var instance = new Mediator()
    assert(typeof instance.addEvent, 'function')
  })
})