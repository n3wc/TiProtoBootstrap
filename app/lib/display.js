/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

/*global $, Alloy, alert, Ti, _, OS_IOS, OS_ANDROID, Promise */

'use strict';

// Module scoped variables.

var statusBarHeightOffset;

if (OS_IOS) {
  statusBarHeightOffset = parseInt(Ti.Platform.version, 10) >= 7 ? 0 : 20;
}

if (OS_ANDROID) {
  // Close enough.
  statusBarHeightOffset = Math.round((25 * Ti.Platform.displayCaps.dpi) / 160);
}

// Exported functions.

exports.getStatusBarHeight = function () {
  if (OS_IOS) {
    return parseInt(Ti.Platform.version, 10) >= 7 ? 20 : 0;
  }

  if (OS_ANDROID) {
    return 0;
  }
};

exports.getWidth = function () {

  return Math.ceil(exports.nativeToDips(Math.min(
    Ti.Platform.displayCaps.platformWidth,
    Ti.Platform.displayCaps.platformHeight
  )));
};

exports.getHeight = function () {

  return Math.ceil(exports.nativeToDips(Math.max(
    Ti.Platform.displayCaps.platformWidth,
    Ti.Platform.displayCaps.platformHeight
  )));
};

exports.dipsToPix = function (dips) {

  if (Ti.Platform.displayCaps.dpi > 160) {
    return (dips * (Ti.Platform.displayCaps.dpi / 160));
  }

  return dips;
};

exports.pixToDips = function (pix) {

  if (Ti.Platform.displayCaps.dpi > 160) {
    return (pix / (Ti.Platform.displayCaps.dpi / 160));
  }

  return pix;
};

exports.sizeToPix = function (size) {

  return {
    width: exports.dipsToPix(size.width),
    height: exports.dipsToPix(size.height)
  };
};

exports.rectToPix = function (rect) {

  return {
    x: exports.dipsToPix(rect.x),
    y: exports.dipsToPix(rect.y),
    width: exports.dipsToPix(rect.width),
    height: exports.dipsToPix(rect.height)
  };
};

exports.nativeToDips = function (nat) {

  if (OS_IOS) {
    return nat;
  }

  if (OS_ANDROID) {
    return nat / Ti.Platform.displayCaps.logicalDensityFactor;
  }
};

exports.fixViewPortrait = function (view) {

  if (OS_IOS) {
    var
    width = Ti.Platform.displayCaps.platformWidth,
    height = Ti.Platform.displayCaps.platformHeight - statusBarHeightOffset;

    if (height < width) {
      width = height;
      height = Ti.Platform.displayCaps.platformWidth;
    }

    view.applyProperties({
      width: width,
      height: height
    });
  }
};

exports.fixViewLandscape = function (view) {
  var
  width = Ti.Platform.displayCaps.platformWidth,
  height = Ti.Platform.displayCaps.platformHeight - statusBarHeightOffset;

  if (height > width) {
    width = height;
    height = Ti.Platform.displayCaps.platformWidth;
  }

  view.applyProperties({
    width: width,
    height: height
  });
};

exports.scaleToScreenWidth = function (view) {
  var
  width = parseInt(view.width, 10),
  height = parseInt(view.height, 10);

  if (Ti.Platform.osname !== 'ipad') {

    view.applyProperties({
      width: Ti.Platform.displayCaps.platformWidth,
      height: Math.round((height *
              Ti.Platform.displayCaps.platformWidth) / width)
    });
  }
};

exports.getNavBarHeight = function () {

  if (OS_IOS) {

    if (parseInt(Ti.Platform.version, 10) >= 7) {
      return 68;

    } else {
      return 48;
    }
  }

  if (OS_ANDROID) {
    return 48;
  }
};
