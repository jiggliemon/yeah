var MediatorMixin = require('./mixin')
var extend = require('yaul/extend')
var slice = Array.prototype.slice

var s = document.createElement('script')
var addNodeMethod = s.addEventListener ? 'addEventListener':'attachEvent'
var removeNodeMethod = s.removeEventLisnener ? 'removeEventLisnener':'detachEvent'

function Mediator (){
  var self = this
  self._events = {};
  self._latched = {};
  self._arguments = {};
  self._switched = {};
}

Mediator.prototype = extend({}, MediatorMixin)

extend(Mediator,{
   emit : function () {
    if (arguments.length) {
      s.dispatchEvent.apply(s,arguments)
    }

    return this
  }

  ,addListener : function ( node, event, fn, capture ) {
    var hasNode = typeof node == 'string'?1:0
    var el = hasNode?s:node
    el[addNodeMethod].apply(el,slice.call(arguments, hasNode))
  }
  
  ,removeListener : function ( node, event, fn, capture ) {
    var hasNode = typeof node == 'string' ?1:0
    var el = hasNode?s:node
    el[removeNodeMethod].apply(el,slice.call(arguments, hasNode))
  }
})

Mediator.on = Mediator.addListener
Mediator.off = Mediator.removeListener

module.exports = Mediator;
