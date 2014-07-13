var appProperties = require('appProperties');

function doClick(e) {
    

}
Ti.API.info('start');

appProperties.setCache('test',{hamg:1},2);
Ti.API.info(appProperties.getCache('test'));

setTimeout(function(){
	Ti.API.info(appProperties.getCache('test'));
},2500);

$.index.open();
