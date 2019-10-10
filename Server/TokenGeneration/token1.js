var fs = require('fs');
var configData = fs.readFileSync('../public/Config/configuration.json');

var cacheReaderFunction = require('../SKUToken/dataCache.js');

const SKUAPIURL = JSON.parse(configData).GOLANGAPIURL;
const SKUAPI_CLIENTID = JSON.parse(configData).SKUTOKEN_CLIENTID;
const SKUAPI_CLIENTSECRET = decrypt(JSON.parse(configData).SKUTOKEN_SECRETID);

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

// Get Token
function GetToken() {
    var response = "";
    var request = require('sync-request');
    var btoa = require('btoa');
    //var authInfo = "Basic " + btoa("warehouse:ph(MH[=/w-Xpt2Yt");
    var authInfo = "Basic " + btoa(SKUAPI_CLIENTID + ":" + SKUAPI_CLIENTSECRET);

    var headerInfo = {
        'Accept': 'text/json',
        'Authorization': authInfo,
        'Cache-Control': 'no-cache',
        'content-type': 'application/json'
    };
    response = request("POST", SKUAPIURL + "/v1/oauth2/token", {
        headers: headerInfo,
        body: 'grant_type=client_credentials',
        timeout: 180000
    });
    response.generated_on = (new Date()).getTime() - 86400000;
    return response.getBody('utf8');
}

// //1. Get Token from cache
// function GetTokenFromCache() {
//     // Get token from cache
//     var tokenInfo = cacheReaderFunction.GetCacheValue("appToken");
//     if (typeof tokenInfo == "undefined" || tokenInfo == null) {
//         var tokenData = GetTokenfromFile();
//         tokenData.then(function (data) {
//             tokenInfo = data;
//             cacheReaderFunction.SetCacheValue("appToken",tokenInfo );
//         }, function (err) {
//         });
//     }
//     else {
//     }

//     return tokenInfo;
// }

function GetTokenFromCache1() {
    try {
        let token;
        let tokenInfo = this._appconfig.envs[this._appconfig.env][params.cenv].token.private;
        token = tokenInfo.token_type + " " + tokenInfo.access_token;
        let currentDT = (new Date()).getTime();
        if (tokenInfo.generated_on + parseInt(tokenInfo.expires_in) < currentDT) {
            this.GeneratePrivateToken(params);
        }
        return token;
    } catch (exception) {
        params.exception = exception;
        params.exceptionmethod = "Helpers - PrivateToken";
        params.exceptionstatus = 417;
        dataLogger.ExceptionLog(params)
            .then(() => {})
            .catch(() => {});
        return "";
    }
}

function GetTokenFromCache() {

    var data = fs.readFileSync('./SKUToken/token.txt', 'utf8');
    var tokenData = "";
    if (data !== '' && data !== null && data !== undefined) {
        console.log(data);
        var token = JSON.parse(data).access_token;
        let generated_on = JSON.parse(data).generated_on;
        let expires_in = JSON.parse(data).expires_in;
        let currentDT = (new Date()).getTime();
        if (token !== '') {
            if (generated_on + parseInt(expires_in) < currentDT) {
                console.log(generated_on + parseInt(expires_in));
                console.log(currentDT);
                return GenerateToken();
            } else {
                return token;
            }
        } else {
            tokenData = GenerateToken();
            return tokenData;
        }
    } else {
        tokenData = GenerateToken();
        return tokenData;
    }



}
// Generate Token
function GenerateToken() {
    var aToken = GetToken();
    //cacheReaderFunction.SetCacheValue("appToken",aToken );
    fs.writeFile('./SKUToken/token.txt', aToken, function (error) {
        if (error) {} else {}
    });
    return aToken;
}

// Token Expiration Code
function TokenExpire(Exception) {
    if (Exception.statusCode == 401) {
        cacheReaderFunction.SetCacheValue("appToken", GetToken());
    }
}


function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var crypto = require('crypto'),
        algorithm = 'aes-256-ctr',
        password = 'd6F3Efeq';
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}


//Two functions will be exposed to all.
//1 . GenerateToken and 2. GetTokenFromCache

//Get Token From Cache
exports.GetTokenFromCache = function () {
    return GetTokenFromCache();
};
//Generate the Token
exports.GenerateToken = function () {
    return GenerateToken();
};