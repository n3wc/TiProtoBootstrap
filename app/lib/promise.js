/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
 evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
 regexp: false, sub: false, vars: false, undef: false, unused: false,
 white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

(function () {
  var es6PromiseSupport = false;
    // global.Promise &&

    // // Some of these methods are missing from experimental implementations.

    // 'cast' in global.Promise &&
    // 'resolve' in global.Promise &&
    // 'reject' in global.Promise &&
    // 'all' in global.Promise &&
    // 'race' in global.Promise &&

    // // Older version of the spec had a resolver object as the arg rather than a
    // // function.

    // (function () {
    //   var resolve;

    //   new global.Promise(function (r) {
    //     resolve = r;
    //   });

    //   return _.isFunction(resolve);
    // }());

  module.exports = es6PromiseSupport ?
    global.Promise : require('promise/promise').Promise;
}());
