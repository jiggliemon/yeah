var MediatorMixin = require('./mixin');

var extend = function (foo, baz) {
  for (var key in baz) {
    if(baz.hasOwnProperty(key)) {
      foo[key] = baz[key];
    }
  }
  return foo;
}

function Mediator (arg){
  if (arg) {
    return extend(arg, MediatorMixin);
  }

  var self = this;
  self._events = {};
  self._latched = {};
  self._arguments = {};
  self._switched = {};

}

Mediator.prototype = extend({}, MediatorMixin);

extend(Mediator, MediatorMixin);

if (typeof document !== 'undefined') {
  var slice = Array.prototype.slice;
  var s = document.createElement('script');
  var addNodeMethod = s.addEventListener ? 'addEventListener':'attachEvent';
  var removeNodeMethod = s.removeEventLisnener ? 'removeEventLisnener':'detachEvent';

  extend(Mediator, {
     emit : function () {
      if (arguments.length) {
        s.dispatchEvent.apply(s,arguments);
      }

      return this;
    }

    ,addListener : function ( node, event, fn, capture ) {
      var hasNode = typeof node == 'string'?1:0;
      var el = hasNode?s:node;
      el[addNodeMethod].apply(el,slice.call(arguments, hasNode));
    }

    ,removeListener : function ( node, event, fn, capture ) {
      var hasNode = typeof node == 'string' ?1:0;
      var el = hasNode?s:node;
      el[removeNodeMethod].apply(el,slice.call(arguments, hasNode));
    }
  })

  Mediator.on = Mediator.addListener;
  Mediator.off = Mediator.removeListener;

  if (typeof window !== 'undefined') {
    if (typeof window.yeah !== 'function') {
      while (yeah.length) {
        var fn = yeah.shift();

      }
    }
    window.yeah = Mediator;
  }
}

module.exports = Mediator;
