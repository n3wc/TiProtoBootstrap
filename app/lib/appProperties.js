/**
 * appProperties
 * Titanium.App.Properties.get* methods can not be garbage collected
 * this facade uses a local sqlite database instead
 * @author Jesse Newcomer @n3wc
 * @link https://github.com/n3wc/
 * @version 1.1
 * 
 * Returns the value of a property as specified data type. Returns defaultValue if key does not exist
 * getBool(key,[defaultValue])
 * getDouble(key,[defaultValue])
 * getInt(key,[defaultValue])
 * getObject(key,[defaultValue])
 * getString(key,[defaultValue])
 * getCache(key,[defaultValue])
 * 
 * Sets the value of a property as specified data type. The property will be created if it does not exist.
 * setBool(key,value)
 * setDouble(key,value)
 * setInt(key,value)
 * setObject(key,value)
 * setString(key,value)
 * setCache(key,value, secondToExpire)
 * 
 * Deletes the key and value of a property.
 * deleteBool(key)
 * deleteDouble(key)
 * deleteInt(key)
 * deleteObject(key)
 * deleteString(key)
 * deleteCache(key)
 * 
 * Returns a boolean whether a property exists.
 * existBool(key)
 * existDouble(key)
 * existInt(key)
 * existObject(key)
 * existString(key)
 * existCache(key)
 * 
 * Deletes all key values in the specified data type collection.
 * clearBool()
 * clearDouble()
 * clearInt()
 * clearObject()
 * clearString()
 * clearCache(expiredOnly)
 * 
 * Returns string array of all keys in the specified data type collection.
 * getAllKeysBool()
 * getAllKeysDouble()
 * getAllKeysInt()
 * getAllKeysObject()
 * getAllKeysString()
 * getAllKeysCache()
 * 
 * Open database 
 * openDatabase()
 * 
 * Allows the database to be manually closed and releases resources from memory
 * closeDatabase()
 * 
 */

var appProperties = function() {

	var databasename = 'appProperties';
	var database;
	var createdTable = false;
	var openDatabase = function(clearExpiredCache){
		database = Ti.Database.open(databasename);
		database.execute('PRAGMA read_uncommitted=true');
		if(!createdTable){
			database.execute('CREATE TABLE IF NOT EXISTS tblBoolean (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data INTEGER)');
			database.execute('CREATE TABLE IF NOT EXISTS tblDouble (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data REAL)');
			database.execute('CREATE TABLE IF NOT EXISTS tblInt (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data INTEGER)');
			database.execute('CREATE TABLE IF NOT EXISTS tblObject (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data TEXT)');
			database.execute('CREATE TABLE IF NOT EXISTS tblString (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data TEXT)');
			database.execute('CREATE TABLE IF NOT EXISTS tblCache (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, data TEXT, expires date)');
			createdTable = true;
			clearData('Cache', clearExpiredCache);
		}
	};
	this.openDatabase = openDatabase;
	var closeDatabase = function(){
		database.close();
	};
	this.closeDatabase = closeDatabase;
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
	this.getCache = function(key, defaultValue){
		return getData(key,'Cache', defaultValue);
	};
	
	function getData(key, dataType, defaultValue){
		if (typeof key == 'undefined') {
			throw new Error("typeof key == 'undefined'");
		}
		var query = 'SELECT * from tbl'+dataType+' WHERE key = ? ';
		
		if(dataType === 'Cache'){
			query += ' and CURRENT_TIMESTAMP < expires ';
		}
		openDatabase();
		var res = database.execute(query + ' LIMIT 1', key);
		var ret = defaultValue;
		if(res !== null){
			while (res.isValidRow()) {
				ret = parseValFromDatabase(res.fieldByName('data'),dataType,defaultValue);
				res.next();
			}
			res.close();
		}
		closeDatabase();
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
		case 'Cache':
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
	this.setCache = function(key, data, secondToExpire){
		return saveData(key,data,'Cache', secondToExpire);
	};
	
	function saveData(key, data, dataType, secondToExpire){
		if ( typeof key == 'undefined') {
			throw new Error("typeof key == 'undefined'");
		}
		if (dataType !== 'Cache' && typeof data !== dataType.toLowerCase() && ! (typeof data === 'number' && (dataType.toLowerCase() === 'int' || dataType.toLowerCase() === 'double'))) {
			throw new Error("typeof data expected as '"+dataType.toLowerCase()+"' instead recieved '"+(typeof data)+"'");
		}
		if(dataType==='Object' || dataType==='Cache'){
			data = JSON.stringify(data);
		}
		try {
			openDatabase();
			var query;
			if(dataType==='Cache'){
				query = 'INSERT OR REPLACE INTO tbl'+dataType+' (key,data,expires) VALUES (?,?,DATETIME(CURRENT_TIMESTAMP, \'+'+secondToExpire+' seconds\'))';
			}else{
				query = 'INSERT OR REPLACE INTO tbl'+dataType+' (key,data) VALUES (?,?)';
			}
			var retVal = database.execute(query, key, data);
			closeDatabase();
			return retVal;
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
	this.deleteCache = function(key){
		return deleteData(key,'Cache');
	};

	deleteData = function(key,dataType) {
		if ( typeof key == 'undefined') {
			throw new Error("typeof key == 'undefined'");
		}

		try {
			openDatabase();
			var retVal = database.execute('DELETE FROM tbl'+dataType+' WHERE key=?', key);
			closeDatabase();
			return retVal;
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
	this.clearCache = function(expiredOnly){
		return clearData('Cache', expiredOnly);
	};
	clearData = function(dataType, expiredOnly) {
		if ( typeof dataType == 'undefined') {
			throw new Error("typeof dataType == 'undefined'");
		}
		try {
			var query = 'DELETE FROM tbl'+dataType;
			if(expiredOnly){
				query += ' WHERE CURRENT_TIMESTAMP > expires ';
			}
			openDatabase();
			var retVal = database.execute(query);
			closeDatabase();
			return retVal;
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
	this.existObject = function(key){
		return existData(key,'Cache');
	};
	this.existString = function(key){
		return existData(key,'String');
	};

	existData = function(key,dataType) {
		if ( typeof key == 'undefined') {
			throw new Error("typeof key == 'undefined'");
		}
		var query = 'SELECT id FROM tbl'+dataType+' WHERE key=? ';
		if(dataType === 'Cache'){
			query += ' and CURRENT_TIMESTAMP > expires ';
		}
		openDatabase();
		var rows = database.execute(query+' LIMIT 1', key);
		var exists = rows?(rows.rowCount > 0):0;
		rows.close();
		closeDatabase();
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
	this.getAllKeysCache = function(){
		return getAllKeysData('Cache');
	};
	
	function getAllKeysData(dataType){
		openDatabase();
		var res = database.execute('SELECT key from tbl'+dataType);
		var ret = [];
		if(res !== null){
			while (res.isValidRow()) {
				ret.push(res.fieldByName('key'));
				res.next();
			}
			res.close();
		}
		closeDatabase();
		return ret;
	}
};

module.exports = new appProperties();
