# Yeah
Yet another event handler (AKA Sub/Pub).  What seperates Yeah from other Sub/Pub helpers is it provides two key features to help deal with event heavy applications; Compound events and Latched events.

```js
window.yeh = window.yeh || [];

yeh.push(['compound', 'app.ready', ['dom.ready','yeh.ready']]);

window.yeh = yeah({
  initialize: function() {
    console.log('Star the application!');
  }
});

$(document).domready(yeh.callMeMaybe('dom.ready'));
yeh.on('app.ready', yeh.initialize);
```
