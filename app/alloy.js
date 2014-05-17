// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.fa = require('fa');







if (OS_ANDROID) {
	getTime = (Date.now ||
	function() {
		return new Date().getTime();
	});

	// Monkey patch throttle and debounce to fix bug in throttle function on
	// Titanium (3.2.0.GA) Android.

	_.throttle = function(func, wait, options) {
		var context, args, result, timeout, previous, later;

		timeout = null;
		previous = 0;
		options = options || {};

		later = function() {
			previous = options.leading === false ? 0 : getTime();
			timeout = null;
			result = func.apply(context, args);
			context = args = null;
		};

		return function() {
			var now, remaining;
			now = getTime();

			if (!previous && options.leading === false) {
				previous = now;
			}

			remaining = wait - (now - previous);
			context = this;
			args = arguments;

			if (remaining <= 0) {
				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);
				context = args = null;

			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}

			return result;
		};
	};

	_.debounce = function(func, wait, immediate) {
		var timeout, args, context, timestamp, result, later = function() {
			var last = getTime() - timestamp;

			if (last < wait) {
				timeout = setTimeout(later, wait - last);

			} else {
				timeout = null;

				if (!immediate) {
					result = func.apply(context, args);
					context = args = null;
				}
			}
		};

		return function() {
			var callNow = immediate && !timeout;

			context = this;
			args = arguments;
			timestamp = getTime();

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}

			if (callNow) {
				result = func.apply(context, args);
				context = args = null;
			}

			return result;
		};
	};
}
