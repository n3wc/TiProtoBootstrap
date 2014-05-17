var args = arguments[0] || {};
$.info.addEventListener('close', function() {
	$.destroy();
});