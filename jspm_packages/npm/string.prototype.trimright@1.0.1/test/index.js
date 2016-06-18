/* */ 
'use strict';
var trimRight = require('../index');
var test = require('tape');
test('as a function', function(t) {
  t.test('bad array/this value', function(st) {
    st.throws(function() {
      trimRight(undefined, 'a');
    }, TypeError, 'undefined is not an object');
    st.throws(function() {
      trimRight(null, 'a');
    }, TypeError, 'null is not an object');
    st.end();
  });
  require('./tests')(trimRight, t);
  t.end();
});
