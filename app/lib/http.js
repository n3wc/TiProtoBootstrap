/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

var xmlToJson = require('xmlToJson');

// Returns a promise for an http request.

exports.request = function (url, method, payload, timeout, mimeType) {
  method = method || 'GET';
  timeout = timeout || 10000;

  return new Promise(function (resolve, reject) {
    Ti.API.info(url);

    var xhr = Ti.Network.createHTTPClient({

      onload: function (event) {
        resolve(this);
      },

      onerror: function (event) {
        reject(this);
      },

      timeout: timeout
    });

    xhr.open(method, url);
    if (mimeType) {

      xhr.setRequestHeader('Content-Type', mimeType);
    }
    xhr.send(payload);
  });
};

// Returns a promise for an http request that is parsed as JSON.

exports.requestJson = function (url, method, payload) {
  var mimeType = null;

  if (_.isObject(payload)) {
    mimeType = 'application/json';
    payload = JSON.stringify(payload);
  }

  return exports.request(url, method, payload, null, mimeType)
    .then(function (xhr) {
    return JSON.parse(xhr.responseText);
  });
};

// Returns a promise for an http request that is parsed as XML and converted
// to JSON.

exports.requestXml = function (url, method, payload) {

  return exports.request(url, method, payload).then(function (xhr) {
    return xmlToJson(xhr.responseXML);
  });
};
