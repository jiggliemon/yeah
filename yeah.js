/**
 * Yeah: Yet Another Event Handler
 * - Handle normal eventing crap. .on, .emit etc.
 * - Handle `latched` events
 * - Handle `composite` events
 * - Handle ga-style event handling yeah.push([method, ...])
 * - Handle event bubbling (woah)
 */
const GLOB = (typeof global !== 'undefined')? global : window;

class yeah {
  static extend(obj) {
    // this should be
    // Object.assign Object.assign(obj, yeah.prototype);
    Object.assign(obj, {
      on: yeah.prototype.on,
      once: yeah.prototype.once,
      compound: yeah.prototype.compound,
      getListener: yeah.prototype.getListener,
      addListener: yeah.prototype.addListener,
      addCompoundListener: yeah.prototype.addCompoundListener,
      removeListener: yeah.prototype.removeListener,
      removeAllListeners: yeah.prototype.removeAllListeners,
      setMaxListeners: yeah.prototype.setMaxListeners,
      listeners: {},
      compoundListeners: {},
      emit: yeah.prototype.emit,
      push: yeah.prototype.push
    });
    return obj;
  }

  constructor(globalName, methods) {
    this.listeners = {};
    this.compoundListeners = {};

    if (typeof globalName == 'string') {
      if(GLOB[globalName]) {
        var yeh = new yeah();
        GLOB[globalName].forEach(yeh.push.bind(yeh));
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
  on(event, callback) {
    var self = this;
    if (Array.isArray(event)) {
      event.forEach((e) => self.addListener(e, callback));
      return;
    }

    this.addListener(event, callback);
  }

  once(event, callback) {
    this.addListener(event, callback, true);
  }

  /**
   * name [String] : name of the event handler
   * events [Array of events] :
   * callback [Object] : the context to fire the event against
   */
  compound(name, events, callback) {
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
  push(args){
    Array.isArray(args)? args.forEach(this.push): true;
    var keys = Object.keys(args);
    var self = this;
    keys.forEach( (method)  => self[method].apply(self, args[method]) );
    return this;
  }

  getListener(event) {
    return this.listeners[event] = this.listeners[event] || new Listener(event, this);
  }

  addListener(event, callback, once) {
    var listener = this.getListener(event);

    if (listener.latched()) {
      callback();
      return this;
    }
    listener.addCallback(callback, once);
    return this;
  }

  removeListener(event, callbacevent, k) {
    var listener = this.getListener(event, callback);
    listener.removeCallback(callback);
  }


  removeAllListeners(){
    var listener = this.getListener(event, callback);
    listener.empty();
  }

  addCompoundListener(name, events, callback){
    var  self = this;
    var listener = this.getListener(name);
    var compoundListener = this.compoundListeners[name] = this.compoundListeners[name] || {};
    let _fireCheck = ()=>{
      if (events.every(key => compoundListener[key].fired)) {
        listener.fire().latch();
      }
    }

    let _removeFireCheck = ()=>{
      Object.keys(compoundListener).forEach(key => compoundListener[key].removeCallback(_fireCheck));
    }


    // todo: loop through this using push/shift
    // so we're sure it fires in order
    events.forEach(( event ) => {
      let listener = self.getListener(event);
      // push the fire check at the front of the stack
      listener.callbacks.unshift(_fireCheck);
      compoundListener[event] = listener;
    });

    if ( callback ) {
      listener.addCallback(callback);
    }

    self.once(name, _removeFireCheck);
    return self;
  }

  emit(event) {
    var listener = this.getListener(event);
    var args = [].slice.call(arguments, 1);
    listener.fire.apply(listener, [new Event(this), args]);

    return listener;
  }

  callMeMaybe(event){
    var self = this;
    return () => this.emit(event)
  }
}

class Listener {

  constructor(name, parent) {
    this.name = name;
    this.parent = parent;
    this.fired = false;
    this._latched = false;
    this.callbacks = [];
    this.metaMap = new WeakMap();
  }


  addCallback(cb, once) {
    if (this._latched) {
      cb();
    } else if(typeof cb == 'function') {
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

  removeCallback(cb) {
    var index = this.callbacks.indexOf(cb);
    if (index !== -1) {
      this.metaMap.delete(this.callbacks.splice(index, 1)[0]);
    }
    return this;
  }

  latched(is) {
    if (typeof is !== 'undefined') {
      this._latched = is;
    }
    return this._latched;
  }


  fire( args, context) {
    this.fired = true;
    let self = this;
    let onces = [];
    let called = [];
    let callback;
    let meta
    
    while (this.callbacks.length){
      callback = self.callbacks.pop();
      meta = self.metaMap.get(callback);
      callback.apply(context || self, args);
      // don't add the call once functions
      if (meta && !meta.once) {
        called.push(callback);
      } else {
        // but remove their metadata
        self.metaMap.delete(callback);
      }
    };
    self.callbacks = called;

    return this;
  }

  empty() {
    this.callbacks = [];
    return this;
  }

  latch(empty = true) {
    this._latched = true;
    if(empty) {
      this.empty();
    }
    return this;
  }

  unlatch() {
    this._latched = false;
  }
}


class Event {
  constructor(target){
    this.name = target.name;
    this.target = target;
  }
}

module.exports = yeah;













