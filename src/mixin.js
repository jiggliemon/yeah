var make = require('yaul/make')
var typeOf = require('yaul/typeOf')
var isArray = require('yaul/isArray')
var hasOwn = require('yaul/hasOwn')
var slice = require('yaul/slice')

function removeLatched(type){
  var _latched = make(this,_LATCHED_, {})
  if ( type.indexOf(':') ) {
    if ( REGEX.test(type) ) {
      type = type.replace(REGEX,'')
      _latched[type] = 1
    }
  }
  return type
}

var REGEX = /:(latch(ed$)?)/i
var call = 'call'
var _EVENTS_ = '_events'
var _SWITCHED_ = '_switched'
var _LATCHED_ = '_latched'
var _ARGUMENTS_ = '_arguments'

var mixin = {
   getEvents: function(key){
     var _events = make(this, _EVENTS_, {})
     var events = _events[type] 

     return typeOf(key,'string') ? events ? events : [] : Object.keys(_events)
  }
  
  ,addCompoundEvent: function ( events, type, callback ) {
    type = removeLatched[call](this,type)
    var  self = this
    var _switched = make(self,_SWITCHED_, {})

    // todo: use yaul/map
    events = events.map(function ( event ) {
      if ( self.grr ) {
        console.log(event)
      }

      event = removeLatched[call](self, event)
      self.addEvent(event, fireCheck)
      return event
    })

    function fireCheck () {
      var length = events.length
      while ( length-- ) {
        if(!_switched[events[length]]) return
      }

      self.fireEvent(type +':latched')
    }
    
    if ( callback ) {
      self.addEvent(type, callback )
    }
  } 

  ,addEvent: function( /* Sting */ type, /* Function */ callback ){

    if ( isArray(type) ) { 
      return this.addCompoundEvent.apply(this, arguments)
    }

    type = removeLatched[call](this,type)
    
    var  self = this
    var _events = make(self, _EVENTS_, {})
    var events = make(_events, type, [])
    var _args,_latched
    
    if (!typeOf(callback,'function')) {
      throw new TypeError('`#addEvent`\'s second argument must be a function') 
    }

    // todo: use yaul/indexOf
    if ( events.indexOf(callback) === -1 ) {
      _args = make(self,_ARGUMENTS_, {})
      _latched = make(self,_LATCHED_, {})
      _latched[type] ? callback.apply(self,_args[type]) : events.push(callback)
    }
    return self
  }

  ,addEvents: function(/* Object */ events){
    var self = this
    for ( var key in events ) {
      if ( hasOwn(events, key) ) {
        self.addEvent(key,events[key])
      }
    }
    return self
  }
  
  ,fireEvent: function(/* String */ type) {
    type = removeLatched[call](this,type)
    var self = this
    var _latched = make(self,_LATCHED_, {})
    var _switched = make(self,_SWITCHED_, {})
    var _args = make(self,_ARGUMENTS_, {})
    var _events = make(self, _EVENTS_, {})
    var isLatched = _latched[type]
    var events = _events[type]
    var length = events ? events.length : 0
    var args = slice(arguments,1)
    var i = 0
    
    _switched[type] = 1
    
    if ( events && length ) {
      for ( ; i < length; i++ ) {
        if ( i in events) {
          //try{
            events[i].apply(self,args)
          //} catch (e) { 
            //window.console && console.log(events[i])
            //throw new Error('Problem with the `'+ type +'` event \n'+ e)
          //}
        }
      }
    }
    
    if ( isLatched ) {
      _args[type] = args
      delete _events[type]
    }
    
    return self
  }

  ,hasFired: function (key) {
    var _switched = make(this,_SWITCHED_, {})
    return _switched[key] ? true : false
  }
}

module.exports = mixin

