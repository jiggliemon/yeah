'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Yeah: Yet Another Event Handler
 * - Handle normal eventing crap. .on, .fire etc.
 * - Handle `latched` events
 * - Handle `composite` events
 * - Handle ga-style event handling yeah.push([method, ...])
 * - Handle event bubbling (woah)
 */
var LATCHED = /:(latch(ed$)?)/i;

var GLOB = typeof global !== 'undefined' ? global : window;

var yeah = function () {
  _createClass(yeah, null, [{
    key: 'extend',
    value: function extend(obj) {
      // this should be
      // Object.assign Object.assign(obj, yeah.prototype);
      Object.assign(obj, {
        on: yeah.prototype.on,
        once: yeah.prototype.once,
        compound: yeah.prototype.compound,
        addListener: yeah.prototype.addListener,
        addCompoundListener: yeah.prototype.addCompoundListener,
        removeListener: yeah.prototype.removeListener,
        removeAllListeners: yeah.prototype.removeAllListeners,
        setMaxListeners: yeah.prototype.setMaxListeners,
        listeners: yeah.prototype.listeners,
        emit: yeah.prototype.emit,
        push: yeah.prototype.push
      });
      return obj;
    }
  }]);

  function yeah(globalName, methods) {
    _classCallCheck(this, yeah);

    this.listeners = {};
    this.compoundListeners = {};

    if (typeof globalName == 'string') {
      if (GLOB[globalName]) {
        var yeh = new yeah();
        GLOB[globalName].forEach(yeh.push);
        GLOB[globalName] = yeh;
      }
      this.getListener(globalName + '.ready').fire().latch();
    }
  }

  /**
   * event [String | Array of strings] : name of the event handler
   * callback [Function] : afunction to fire when event is triggered
   * context [Object] : the context to fire the event against
   */


  _createClass(yeah, [{
    key: 'on',
    value: function on(event, callback) {
      var self = this;
      if (Array.isArray(event)) {
        event.forEach(function (e) {
          this.addListener(e, callback);
        }.bind(this));
        return;
      }

      this.addListener(event, callback);
    }
  }, {
    key: 'once',
    value: function once(event, callback) {
      this.addListener(event, callback, true);
    }

    /**
     * name [String] : name of the event handler
     * events [Array of events] :
     * callback [Object] : the context to fire the event against
     */

  }, {
    key: 'compound',
    value: function compound(name, events, callback) {
      return this.addCompoundListener(name, events, callback);
    }

    /**
     * namespace.push({on: ['ready', fn ]})
     * namespace.push([
     *  {on: ['ready', fn ]},
     *  {compound: ['start', ['ready', 'domready']]},
     *  {on: ['start', namespace.initialize]}
     * ])
     *
     */

  }, {
    key: 'push',
    value: function push(args) {
      Array.isArray(args) ? args.forEach(this.push) : true;
      var keys = Object.keys(args);
      var self = this;
      keys.forEach(function (method) {
        self[method].apply(self, args[method]);
      });
      return this;
    }
  }, {
    key: 'getListener',
    value: function getListener(event) {
      return this.listeners[event] = this.listeners[event] || new Listener(event, this);
    }
  }, {
    key: 'addListener',
    value: function addListener(event, callback, once) {
      var listener = this.getListener(event);

      if (listener.latched()) {
        callback();
        return this;
      }
      listener.addCallback(callback, once);
      return this;
    }
  }, {
    key: 'removeListener',
    value: function removeListener(event, callbacevent, k) {
      var listener = this.getListener(event, callback);
      listener.removeCallback(callback);
    }
  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners() {
      var listener = this.getListener(event, callback);
      listener.empty();
    }
  }, {
    key: 'addCompoundListener',
    value: function addCompoundListener(name, events, callback) {
      var self = this;
      var listener = this.getListener(name);
      var compoundListener = this.compoundListeners[name] = this.compoundListeners[name] || {};

      events.forEach(function (event) {
        var listener = self.getListener(event);
        listener.addCallback(_fireCheck);
        compoundListener[event] = listener;
      });

      function _fireCheck() {
        if (Object.keys(compoundListener).some(function (key) {
          return compoundListener[key].fired;
        })) {
          listener.fire().latch();
        }
      }

      function _removeFireCheck() {
        Object.keys(compoundListener).forEach(function (key) {
          return compoundListener[key].removeCallback(_fireCheck);
        });
      }

      if (callback) {
        listener.addCallback(callback);
      }

      self.once(name, _removeFireCheck);
      return self;
    }
  }, {
    key: 'emit',
    value: function emit(event) {
      var listener = this.getListener(event);
      var args = [].slice.call(arguments, 1);
      listener.fire.apply(listener, args);

      return listener;
    }
  }]);

  return yeah;
}();

var Listener = function () {
  function Listener(name, parent) {
    _classCallCheck(this, Listener);

    this.name = name;
    this.parent = parent;
    this.fired = false;
    this._latched = false;
    this.callbacks = [];
    this.metaMap = new WeakMap();
  }

  _createClass(Listener, [{
    key: 'addCallback',
    value: function addCallback(cb, once) {
      if (this._latched) {
        cb();
      } else if (typeof cb == 'function') {
        var meta = this.metaMap.get(cb);
        if (meta == undefined) {
          this.callbacks.push(cb);
          meta = {};
          if (once) {
            meta.once = true;
          }

          this.metaMap.set(cb, meta);
        }
      }
    }
  }, {
    key: 'removeCallback',
    value: function removeCallback(cb) {
      var index = this.callbacks.indexOf(cb);
      if (index !== -1) {
        this.metaMap.delete(this.callbacks.splice(index, 1)[0]);
      }
      return this;
    }
  }, {
    key: 'latched',
    value: function latched(is) {
      if (typeof is !== 'undefined') {
        this._latched = is;
      }
      return this._latched;
    }
  }, {
    key: 'fire',
    value: function fire(args, context) {
      var self = this;
      var onces = [];
      this.callbacks.forEach(function (callback) {
        var meta = self.metaMap.get(callback);
        if (meta.once) {
          onces.push(callback);
        }

        callback.apply(context || self, args);
      });
      if (onces.length) {
        onces.forEach(self.removeCallback.bind(self));
      }

      this.fired = true;

      return this;
    }
  }, {
    key: 'empty',
    value: function empty() {
      this.callbacks = [];
      return this;
    }
  }, {
    key: 'latch',
    value: function latch() {
      var empty = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this._latched = true;
      if (empty) {
        this.empty();
      }
      return this;
    }
  }, {
    key: 'unlatch',
    value: function unlatch() {
      this._latched = false;
    }
  }]);

  return Listener;
}();

;

module.exports = yeah;
