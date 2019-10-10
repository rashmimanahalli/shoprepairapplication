const axios = require('axios');
const qs = require('qs');
var fs = require('fs');
const fsAccess = require("./fsaccess");
let tokenData = require('./token.json');
var cacheReaderFunction = require('../SKUToken/dataCache.js');
var configData = fs.readFileSync('../public/Config/configuration.json');



const SKUAPIURL = JSON.parse(configData).GOLANGAPIURL;
const SKUAPI_CLIENTID = JSON.parse(configData).SKUTOKEN_CLIENTID;
const SKUAPI_CLIENTSECRET = decrypt(JSON.parse(configData).SKUTOKEN_SECRETID);

function decrypt(text) {
    var crypto = require('crypto'),
        algorithm = 'aes-256-ctr',
        password = 'd6F3Efeq';
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

class Helpers {
    constructor() {
        this._appconfig = tokenData;
    }

    // PrivateToken(params) {
	// 	try {
	// 		if (params.generatetoken && Boolean(params.generatetoken)) {
	// 			this.GeneratePrivateToken(params);
	// 		}
	// 		return this._appconfig;
	// 	}
	// 	catch (exception) {
	// 		params.exception = exception;
	// 		params.exceptionmethod = "Helpers - PrivateToken";
	// 		params.exceptionstatus = 417;
	// 		dataLogger.ExceptionLog(params)
	// 			.then(() => { })
	// 			.catch(() => { });
	// 		return "";
	// 	}
    // }
    
    GetTokenFromCache(params) {
        try {
            let token;
            // let authInfo = "Basic " + btoa(SKUAPI_CLIENTID + ":" + SKUAPI_CLIENTSECRET);
            // console.log(authInfo);
            let tokenInfo = this._appconfig;
            token = tokenInfo.access_token;          
            let currentDT = (new Date()).getTime();           
            console.log("as " + tokenInfo.generated_on);
            console.log("as " + tokenInfo.expires_in);
            console.log("as " + currentDT);
            if (tokenInfo.generated_on + parseInt(tokenInfo.expires_in) < currentDT) {
                console.log("1");
                this.GeneratePrivateToken(params);
            }
            console.log(token);
            return JSON.stringify(tokenInfo);
        } catch (exception) {
            return "";
        }
    }

    GeneratePrivateToken(params) {
        let urlInfo = SKUAPIURL + "/v1/oauth2/token";
        let btoa = require('btoa');
        //Apply Base 64-bit encoding for ClientID & SecretID and append with Basic to pass in Go lang API.
        let authInfo = "Basic " + btoa(SKUAPI_CLIENTID + ":" + SKUAPI_CLIENTSECRET);
        console.log(SKUAPI_CLIENTID);
        console.log(SKUAPI_CLIENTSECRET);
        console.log(authInfo);
        const data = {
            grant_type: 'client_credentials'
        };
        const options = {
            method: 'post',
            headers: {
                'Accept': 'text/json',
                'Authorization': authInfo,
                'Cache-Control': 'no-cache',
                'content-type': 'application/json',                
            },
            data: qs.stringify(data),
            url: urlInfo
        };
        console.log(options);
        let promise = new Promise((resolve) => {
            axios(options)
                .then(res => {                    
                    let result = {
                        statusCode: res.status,
                        body: res.data
                    };
                    console.log("asd: " +result);

                    if (result.statusCode && result.statusCode == 200) {
                        if (res.headers["crateapi-forwarded-status"] && res.headers["crateapi-forwarded-status"] != 200) {
                            result.statusCode = res.headers["crateapi-forwarded-status"];
                            result.message = res.headers["crateapi-forwarded-message"];
                        }
                    }
                    if (result.body.statusCode && result.statusCode != result.body.statusCode) {
                        result.statusCode = result.body.statusCode;
                    }
                    this._appconfig = res.data;
                    this._appconfig.expires_in = res.data.expires_in * 1000;
                    this._appconfig.generated_on = (new Date()).getTime() - 86400000;                    
                    fsAccess.WriteDataFile({ path: "../Server/TokenGeneration/token.json", data: this._appconfig })
                    .then(() => {console.log("Success")  })
					.catch((error) => { console.log(error) });
                    resolve(result);                    
                })
                .catch(err => {
                    console.log(err);
                    let statusCode = err.toString().substring(err.toString().length - 3);
                    resolve({
                        statusCode: isNaN(statusCode) ? 417 : parseInt(statusCode)
                    });                   
                });
        });
        return promise;
    }
  
   
}

module.exports = new Helpers();