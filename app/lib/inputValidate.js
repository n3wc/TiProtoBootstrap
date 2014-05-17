/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

exports.isValidName = function (name) {
  name = name = name.replace(/\s+/g, '');
  return name.match('[A-Za-z]+$') || '';
};

exports.isValidEmail = function (email) {
  return (/\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3}/).test(email);
};

exports.isValidPhoneNumber = function (number) {
  var error = '',
      stripped = number.replace(/[\(\)\.\-\ ]/g, '');

  if (number === '') {

    error = 'Phone number field empty.  Please enter a phone number.\n';
  } else if (isNaN(parseInt(stripped, 10))) {

    error = 'Invalid character(s) entered in phone number provided.\n';
  } else if (stripped.length !== 10) {

    error = 'Invalid phone number length.  Please include area code in the ' +
            'phone number.';
  } else {

    return true;
  }

  return false;
};
