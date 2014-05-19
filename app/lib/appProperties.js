/**
 * appProperties
 * Titanium.App.Properties.get* methods can not be garbage collected
 * this facade uses a local sqlite database instead
 * @author Jesse Newcomer @n3wc
 * @link https://github.com/n3wc/
 * @version 1.0
 * 
 * Returns the value of a property as specified data type. Returns defaultValue if key does not exist
 * getBool(key,[defaultValue])
 * getDouble(key,[defaultValue])
 * getInt(key,[defaultValue])
 * getObject(key,[defaultValue])
 * getString(key,[defaultValue])
 * 
 * Sets the value of a property as specified data type. The property will be created if it does not exist.
 * setBool(key,value)
 * setDouble(key,value)
 * setInt(key,value)
 * setObject(key,value)
 * setString(key,value)
 * 
 * Deletes the key and value of a property.
 * deleteBool(key)
 * deleteDouble(key)
 * deleteInt(key)
 * deleteObject(key)
 * deleteString(key)
 * 
 * Returns a boolean whether a property exists.
 * existBool(key)
 * existDouble(key)
 * existInt(key)
 * existObject(key)
 * existString(key)
 * 
 * Deletes all key values in the specified data type collection.
 * clearBool()
 * clearDouble()
 * clearInt()
 * clearObject()
 * clearString()
 * 
 * Returns string array of all keys in the specified data type collection.
 * getAllKeysBool()
 * getAllKeysDouble()
 * getAllKeysInt()
 * getAllKeysObject()
 * getAllKeysString()
 * 
 * Open database if manually closed
 * openDatabase()
 * 
 * Allows the database to be manually closed and releases resources from memory
 * closeDatabase()
 * 
 */

var appProperties = function() {

	var databasename = 'appProperties';
	var database;
	
	this.openDatabase = function(){
		database = Ti.Database.open(databasename);
		database.execute('PRAGMA read_uncommitted=true');
		database.execute('CREATE TABLE IF NOT EXISTS tblBoolean (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data INTEGER)');
		database.execute('CREATE TABLE IF NOT EXISTS tblDouble (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data REAL)');
		database.execute('CREATE TABLE IF NOT EXISTS tblInt (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data INTEGER)');
		database.execute('CREATE TABLE IF NOT EXISTS tblObject (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data TEXT)');
		database.execute('CREATE TABLE IF NOT EXISTS tblString (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data TEXT)');
	};
	
	this.closeDatabase = function(){
		database.close();
	};
	this.getBool = function(key, defaultValue){
		return getData(key,'Boolean', defaultValue);
	};
	this.getDouble = function(key, defaultValue){
		return getData(key,'Double', defaultValue);
	};
	this.getInt = function(key, defaultValue){
		return getData(key,'Int', defaultValue);
	};
	this.getObject = function(key, defaultValue){
		return getData(key,'Object', defaultValue);
	};
	this.getString = function(key, defaultValue){
		return getData(key,'String', defaultValue);
	};
	
	function getData(key, dataType, defaultValue){
		if (typeof key == 'undefined') {
			throw new Error("typeof key == 'undefined'");
		}
		var res = database.execute('SELECT * from tbl'+dataType+' WHERE key = ? LIMIT 1', key);
		var ret = defaultValue;

		while (res.isValidRow()) {
			ret = parseValFromDatabase(res.fieldByName('data'),dataType,defaultValue);
			res.next();
		}
		res.close();
		return ret;
	}
	function parseValFromDatabase(data,dataType,defaultValue){
		if (typeof data == 'undefined') {
			return defaultValue;
		}
		switch (dataType) {
		case 'Boolean':
		    return data?true:false;
		    break;
		case 'Object':
		    return JSON.parse(data);
		    break;
		default:
		    return data;
		    break;
		} 
	}
	
	this.setBool = function(key, data){
		if(data===1||data===0){data=data?true:false;}
		return saveData(key,data,'Boolean');
	};
	this.setDouble = function(key, data){
		return saveData(key,data,'Double');
	};
	this.setInt = function(key, data){
		return saveData(key,data|0,'Int');// | 0 truncates if double
	};
	this.setObject = function(key, data){
		return saveData(key,data,'Object');
	};
	this.setString = function(key, data){
		return saveData(key,data,'String');
	};
	function saveData(key, data, dataType){
		if ( typeof key == 'undefined') {
			throw new Error("typeof key == 'undefined'");
		}
		if (typeof data !== dataType.toLowerCase() && ! (typeof data === 'number' && (dataType.toLowerCase() === 'int' || dataType.toLowerCase() === 'double'))) {
			throw new Error("typeof data expected as '"+dataType.toLowerCase()+"' instead recieved '"+(typeof data)+"'");
		}
		if(dataType==='Object'){
			data = JSON.stringify(data);
		}
		try {
			return database.execute('INSERT OR REPLACE INTO tbl'+dataType+' (key,data) VALUES (?,?)', key, data);

		} catch(e) {
			throw new Error(e);
		}
	}

	this.deleteBool = function(key){
		return deleteData(key,'Boolean');
	};
	this.deleteDouble = function(key){
		return deleteData(key,'Double');
	};
	this.deleteInt = function(key){
		return deleteData(key,'Int');
	};
	this.deleteObject = function(key){
		return deleteData(key,'Object');
	};
	this.deleteString = function(key){
		return deleteData(key,'String');
	};

	deleteData = function(key,dataType) {
		if ( typeof key == 'undefined') {
			throw new Error("typeof key == 'undefined'");
		}

		try {
			return database.execute('DELETE FROM tbl'+dataType+' WHERE key=?', key);
		} catch(e) {
			throw new Error(e);
		}

	};
	
	this.clearBool = function(){
		return clearData('Boolean');
	};
	this.clearDouble = function(){
		return clearData('Double');
	};
	this.clearInt = function(){
		return clearData('Int');
	};
	this.clearObject = function(){
		return clearData('Object');
	};
	this.clearString = function(){
		return clearData('String');
	};
	clearData = function(dataType) {
		if ( typeof dataType == 'undefined') {
			throw new Error("typeof dataType == 'undefined'");
		}
		try {
			return database.execute('DELETE FROM tbl'+dataType);
		} catch(e) {
			throw new Error(e);
		}

	};
	
	this.existBool = function(key){
		return existData(key,'Boolean');
	};
	this.existDouble = function(key){
		return existData(key,'Double');
	};
	this.existInt = function(key){
		return existData(key,'Int');
	};
	this.existObject = function(key){
		return existData(key,'Object');
	};
	this.existString = function(key){
		return existData(key,'String');
	};

	existData = function(key,dataType) {
		if ( typeof key == 'undefined') {
			throw new Error("typeof key == 'undefined'");
		}

		var rows = database.execute('SELECT id FROM tbl'+dataType+' WHERE key=? LIMIT 1', key);
		var exists = (rows.rowCount > 0);
		rows.close();
		return exists;

	};
	
	
	this.getAllKeysBool = function(){
		return getAllKeysData('Boolean');
	};
	this.getAllKeysDouble = function(){
		return getAllKeysData('Double');
	};
	this.getAllKeysInt = function(){
		return getAllKeysData('Int');
	};
	this.getAllKeysObject = function(){
		return getAllKeysData('Object');
	};
	this.getAllKeysString = function(){
		return getAllKeysData('String');
	};
	
	function getAllKeysData(dataType){
		var res = database.execute('SELECT key from tbl'+dataType);
		var ret = [];
		while (res.isValidRow()) {
			ret.push(res.fieldByName('key'));
			res.next();
		}
		res.close();
		return ret;
	}
};

module.exports = new appProperties();
