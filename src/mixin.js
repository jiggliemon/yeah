function make (context, key, value ) {
  context[key] = context[key] || value
  return context[key]
}

function typeOf(obj, is) {
  var type = Object.prototype.toString.call(obj).slice(8,-1).toLowerCase()
  return is? type == is : type
}

function hasOwn (what, key) {
  return Object.prototype.hasOwnProperty.call(what,key)
}

function slice (obj, offset) {
  return Array.prototype.slice.call(obj, offset)
}

function remove (arr, from, to) {
  if (from < 0) return arr
  var rest = arr.slice(parseInt(to || from) + 1 || arr.length)
  arr.length = from < 0 ? arr.length + from : from
  return arr.push.apply(arr, rest)
}

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

function concatEvent (self, events, callback) {
  // todo: use yaul/indexOf
  if ( events.indexOf(callback) == -1 ) {
    events.push(callback)
  }
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
     var events = _events[key] 
     return key ? events ? events : [] : Object.keys(_events)
  }
  
  ,addCompoundEvent: function ( events, type, callback ) {
    type = removeLatched[call](this,type)
    var  self = this
    var _switched = make(self,_SWITCHED_, {})

    // todo: use yaul/map
    events = events.map(function ( event ) {
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

    return self
  } 

  ,addEvent: function( /* Sting */ type, /* Function */ callback ){

    if ( typeOf(type, 'array') ) { 
      return this.addCompoundEvent.apply(this, arguments)
    }

    type = removeLatched.call(this,type)
    
    var  self = this
    var _events = make(self, _EVENTS_, {})
    var events = make(_events, type, [])
    var _args = make(self,_ARGUMENTS_, {})
    var _latched = make(self,_LATCHED_, {})
    var isLatched = _latched[type]

    var callbackType = typeOf(callback)
    if (callbackType == 'function'){
      if (isLatched) {
        callback.apply(self,_args[type])
      } else {
        if (events.indexOf(callback) == -1) {
          events.push(callback)
        }
      }
    } else if (callbackType == 'array') {
      for (var i = 0; i < callback.length; i++) {
        if (typeof callback[i] == 'function') {
          if (isLatched) {
            callback[i].apply(self, _args[type])
          } else {
            if (events.indexOf(callback[i]) == -1) {
              events.push(callback[i])
            }
          }
        }
      }
    } else {
      throw new TypeError('`#addEvent`\'s second argument must be a function or an array') 
    }

    return self
  }

  ,removeEvent: function (type, callback) {
    var self = this
    var _events = make(self, _EVENTS_, {})
    var events = make(_events, type, [])
    var i = events.indexOf(callback)
    if (i) {
      events = remove(events,i)
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
          try{
            events[i].apply(self,args)
          } catch (e) { }
        }
      }
    }
    
    if ( isLatched ) {
      _args[type] = args
      _events[type] = []
    }
    
    return self
  }

  ,hasFired: function (key) {
    var _switched = make(this,_SWITCHED_, {})
    return _switched[key] ? true : false
  }
}

module.exports = mixin

