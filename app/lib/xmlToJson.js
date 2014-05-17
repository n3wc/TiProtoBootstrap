/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

// Does a simple XML to JSON conversion.
// Does not convert attributes.
// Multiple child nodes with the same name are put into an array.

module.exports = function (xml) {
  var json = nodeListToJson(xml.firstChild, {});

  // iOS and Android handle xml differently.
  // Android will have the top level XML object.
  // iOS unwraps this top level object.
  // Since all our API's use WSResultContainer as a top level object,
  // this normalizes the returned JSON object.

  return json.WSResultContainer || json;

  function nodeListToJson(node, json) {

    if (!node) {
      return json;
    }

    if (node.nodeType === xml.TEXT_NODE) {
      return node.textContent;

    } else {

      if (json[node.nodeName]) {

        if (!_.isArray(json[node.nodeName])) {
          json[node.nodeName] = [json[node.nodeName]];
        }

        json[node.nodeName].push(nodeListToJson(node.firstChild, {}));

      } else {
        json[node.nodeName] = nodeListToJson(node.firstChild, {});
      }

      return nodeListToJson(node.nextSibling, json);
    }
  }
};
