var request = require('sync-request');
var token = require('../TokenGeneration/token.js');
var logger = require('../../Server/Common/logger.js');
const axios = require('axios');




class RepairCodes {
    GetRepairCodes(locale, dept, skuClass, apiurl, ipaddress, dateNow) {
        try {
            var urlInfo = apiurl + '/v1/repair_codes?locale=' + locale + "&dept=" + dept + "&class=" + skuClass;

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
                        logger.logAPIData(dateNow, ipaddress, locale, "GetRepairCodes", urlInfo, " ", result.statusCode, "GET").then((sucess) => {})
                            .catch((error) => {
                                console.log(error);
                            });
                        resolve(result);
                    })
                    .catch(err => {
                        console.log(err);
                        let statusCode = err.toString().substring(err.toString().length - 3);
                        resolve({
                            statusCode: isNaN(statusCode) ? 417 : parseInt(statusCode)
                        });
                        logger.logAPIData(dateNow, ipaddress, locale, "GetRepairCodes", urlInfo, err, statusCode, "GET").then((sucess) => {})
                            .catch((error) => {
                                console.log(error);
                            });
                    });
            });
            return promise;
        } catch (err) {
            console.log(err);
            return new Promise((resolve, reject) => {
                resolve({
                    statusCode: 417
                });
            });
        }
    }
    GetRepairCodeDetailsbyRepairNumber(repairNum, location, locale, apiurl, ipaddress, tokenData, dateNow) {
        try {
            var urlInfo = apiurl + "/v1/repairs/" + repairNum + "?locale=" + locale + "&loc=" + location + "&ip=" + ipaddress;

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
                        logger.logAPIData(dateNow, ipaddress, locale, "GetRepairCodeDetailsbyRepairNumber", urlInfo, " ", result.statusCode, "GET").then((sucess) => {})
                            .catch((error) => {
                                console.log(error);
                            });
                        resolve(result);
                    })
                    .catch(err => {
                        console.log(err);
                        let statusCode = err.toString().substring(err.toString().length - 3);
                        resolve({
                            statusCode: isNaN(statusCode) ? 417 : parseInt(statusCode)
                        });
                        logger.logAPIData(dateNow, ipaddress, locale, "GetRepairCodeDetailsbyRepairNumber", urlInfo, err, statusCode, "GET").then((sucess) => {})
                            .catch((error) => {
                                console.log(error);
                            });
                    });
            });
            return promise;
        } catch (err) {
            console.log(err);
            return new Promise((resolve, reject) => {
                resolve({
                    statusCode: 417
                });
            });
        }
    }
}
module.exports = new RepairCodes();