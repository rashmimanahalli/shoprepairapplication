var fs = require('fs');
var cacheReaderFunction = require('./dataCache.js');
var configData = fs.readFileSync('../public/Config/configuration.json');
var token = require('../TokenGeneration/token.js');
var logger = require('../../Server/Common/logger.js');
var request = require('sync-request');
const axios = require('axios');

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

const SKUAPIURL = JSON.parse(configData).GOLANGAPIURL;


class SKUDetail {

    GetSKUDetails(sku, locale, effectivedate, ipaddress, dateNow) {
        try {
            var urlInfo = SKUAPIURL + "/v1/enterprise_items" + "/" + sku + "?locale=" + locale + "&effectivedate=" + effectivedate;
            let promise = new Promise((resolve, reject) => {
                axios
                    .get(urlInfo, {
                        headers: {
                            'Accept': 'text/json',
                            'Authorization': "Bearer " + JSON.parse(token.GetTokenFromCache()).access_token,
                            'Cache-Control': 'no-cache',
                            'content-type': 'application/json'
                        }
                    })
                    .then(res => {
                        let status = res.data.statusCode;
                        if (status == undefined) {
                            status = res.headers["crateapi-forwarded-status"];
                        }
                        let result = {
                            statusCode: res.status,
                            body: res.data
                        };
                        logger.logAPIData(dateNow, ipaddress, locale, "GetSKUDetails", urlInfo, " ", result.statusCode, "GET").then((sucess) => {})
                            .catch((error) => {
                                console.log(error);
                            });                        
                        resolve(result);
                    })
                    .catch(err => {
                        console.log(err);
                        let statusCode = err.toString().substring(err.toString().length - 3);
                        resolve({ statusCode: isNaN(statusCode) ? 417 : parseInt(statusCode) });
                        logger.logAPIData(dateNow, ipaddress, locale, "GetSKUDetails", urlInfo, err, statusCode, "GET").then((sucess) => {})
                            .catch((error) => {
                                console.log(error);
                            });
                    });
            });
            return promise;
            //return response.getBody('utf8');
        } catch (err) {
            console.log(err);
            return new Promise((resolve, reject) => {
                resolve({
                    statusCode: 417
                });
            });
            //throw err;
        }
    }



}
module.exports = new SKUDetail();