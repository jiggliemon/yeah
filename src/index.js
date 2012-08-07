//@ sourceURL = blocks/mediator/index.js

var MediatorMixin = require('./mixin')
var extend = require('yaul/extend')

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
   add : function () {

   }
  ,remove : function () {

  }
  ,fire : function () {

  }
  ,addListener : function ( node, event, fn, capture ) {
    node[addNodeMethod](event, fn, capture )
  }
  ,removeListener : function ( node, event, fn, capture ) {
    node[removeNodeMethod](event, fn, capture)
  }

})

module.exports = Mediator;

//@ sourceURL = blocks/mediator/index.js