/* */ 
'use strict';
var trimLeft = require('../index');
var test = require('tape');
test('as a function', function(t) {
  t.test('bad array/this value', function(st) {
    st.throws(function() {
      trimLeft(undefined, 'a');
    }, TypeError, 'undefined is not an object');
    st.throws(function() {
      trimLeft(null, 'a');
    }, TypeError, 'null is not an object');
    st.end();
  });
  require('./tests')(trimLeft, t);
  t.end();
});
