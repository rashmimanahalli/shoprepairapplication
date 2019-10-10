// Application Cache
//Node Library class for cache.
var appCache = require('node-cache');
//Cache object hold application cached data.
var cacheData = new appCache();

//Get Value of cached by datacache name.
function GetValue(key) {

    return cacheData.get(key);
}
//Set value to cachefor datacache name (key).
function SetValue(key, value) {
    cacheData.set(key, value);
}

//Get cached value
exports.GetCacheValue = function(key)
{
    return GetValue(key);
};

//Set value to cache.
exports.SetCacheValue = function(key, value)
{
    SetValue(key, value);
};
