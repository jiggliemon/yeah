import 'babel-polyfill'

var yeah = require('../yeah');
var expect = require('chai').expect;

describe('yeah', function() {
  var yeh;
  var called = 0, alsoCalled = 0;

  function aCallback() {
    called++;
  }

  function anotherCallback() {
    alsoCalled++;
  }

  beforeEach(function () {
    called = 0;
    yeh = new yeah('yeh');
  });

  describe('yeah#extend', function() {
    it('should extend an existing object if passed in as an argument', function() {
      var thing = yeah.extend({aprop: 'theProp'});
      expect(thing).to.have.property('aprop', 'theProp');
      expect(thing).to.have.property('on', yeah.prototype.on);
    });
  });

  describe('yeah.on', function() {
    it('should add a callback to a specified event', function() {
      yeh.on('callit', aCallback);
      yeh.emit('callit');
      expect(called).to.equal(1);
    });
  });

  describe('yeah.once', function() {
    it('should only fire a callback once.', function() {
      yeh.once('fire once', aCallback);
      yeh.emit('fire once');
      yeh.emit('fire once');
      expect(called).to.equal(1);
    });

    it('shouldn\'t effect other callbacks', () => {
      yeh.once('fire once', aCallback);
      yeh.on('fire once', anotherCallback);
      yeh.emit('fire once');
      expect(alsoCalled).to.equal(1);
    })
  });

  describe('yeah.compound', function(){
    it('should only fire once all the events in the events array have been fired', function() {
      yeh.compound('app.ready', ['dom.ready','yeh.ready'], aCallback);
      expect(called).to.equal(0);
      yeh.emit('dom.ready');
      expect(called).to.equal(1);
    });
  });

  describe('yeah listener.latch', () =>{
    it('should immediatly fire events added to a listener that has been `latched`', () => {
      yeh.emit('been latched').latch();
      yeh.on('been latched', aCallback);
      expect(called).to.equal(1);
    })
  });

});