var request = require('sync-request');
var token = require('../TokenGeneration/token.js');
var logger = require('./logger.js');
const axios = require('axios');

class Validation {
    ValidateData(locale, location, po, salesNum, sfx, srcLoc, sku, apiurl, ipaddress, dateNow) {
        try {

            var urlInfo = apiurl + '/v1/validate_repair?locale=' + locale + "&loc=" + location + "&sku=" + sku;

            if (po.length > 0)
                urlInfo = urlInfo + "&po=" + po;
            if (salesNum.length > 0)
                urlInfo = urlInfo + "&saleno=" + salesNum;
            if (sfx.length > 0)
                urlInfo = urlInfo + "&suffix=" + sfx;
            if (srcLoc.length > 0)
                urlInfo = urlInfo + "&srcloc=" + srcLoc;


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
                        var result ={statusCode: res.status , body: res.data};                        
                        let status = res.data.statusCode;
                        if (status == undefined) {
                            status = res.headers["crateapi-forwarded-status"];
                        }

                        logger.logAPIData(dateNow, ipaddress, locale, "ValidateData", urlInfo, " ", result.statusCode, "GET").then((sucess) => {})
                            .catch((error) => {
                                console.log(error);
                            });
                        resolve(result);
                    })
                    .catch(err => {
                        console.log(err);
                        let statusCode = err.toString().substring(err.toString().length - 3);
                        resolve({ statusCode: isNaN(statusCode) ? 417 : parseInt(statusCode) });
                        logger.logAPIData(dateNow, ipaddress, locale, "ValidateData", urlInfo, err, statusCode, "GET").then((sucess) => {})
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
        }
    }
}

module.exports = new Validation();