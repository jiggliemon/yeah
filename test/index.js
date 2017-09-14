import 'babel-polyfill'

var yeah = require('../yeah');
var expect = require('chai').expect;

describe('yeah', function() {

  var yeh,
      called = 0, 
      alsoCalled = 0;

  let aCallback = ()=>{
    called++;
  }

  let anotherCallback = ()=>{
    alsoCalled++;
  }

  beforeEach(() => {
    called = 0;
    alsoCalled = 0;
    yeh = new yeah('yeh');
  });

  describe('yeah#extend', () => {
    it('should extend an existing object if passed in as an argument', () => {
      var thing = yeah.extend({aprop: 'theProp'});
      expect(thing).to.have.property('aprop', 'theProp');
      expect(thing).to.have.property('on', yeah.prototype.on);
    });
  });

  describe('yeah.on', () => {
    it('should add a callback to a specified event', () => {
      yeh.on('callit', aCallback);
      yeh.emit('callit');
      expect(called).to.equal(1);
    });
  });

  describe('yeah.once', () => {
    it('should only fire a callback once.', () => {
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
    });
  });

  describe('yeah.compound', () => {
    it('should only fire once all the events in the events array have been fired', () => {
      yeh.compound('app.ready', ['dom.ready','yeh.ready','another.thing'], aCallback);
      expect(called).to.eq(0);
      yeh.emit('dom.ready');
      expect(called).to.eq(0);
      yeh.emit('another.thing')
      expect(called).to.eq(1);
      yeh.on('app.ready', aCallback);
      expect(called).to.eq(2);
    });
  });

  describe('yeah listener.latch', () => {
    it('should immediatly fire events added to a listener that has been `latched`', () => {
      yeh.emit('been latched').latch();
      yeh.on('been latched', aCallback);
      expect(called).to.equal(1);
    });
  });

});