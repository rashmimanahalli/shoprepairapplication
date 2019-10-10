var appToken;
var request = require('sync-request');
var token = require('../TokenGeneration/token.js');
var logger = require('./logger.js');
const axios = require('axios');

class Common {
    GetRepairPersons(locale, location, apiurl, ipaddress, dateNow) {
        try {
            var urlInfo = apiurl + "/v1/repair_persons?locale=" + locale + "&loc=" + location;
            //return response.getBody('utf8');
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
                        let result = {
                            statusCode: res.status,
                            body: res.data
                        };
                        let status = res.data.statusCode;
                        if (status == undefined) {
                            status = res.headers["crateapi-forwarded-status"];
                        }
                        logger.logAPIData(dateNow, ipaddress, locale, "GetRepairPersons", urlInfo, " ", result.statusCode, "GET").then((sucess) => {})
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
                        logger.logAPIData(dateNow, ipaddress, locale, "GetRepairPersons", urlInfo, err, statusCode, "GET").then((sucess) => {})
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

    GetControlData(file, type, locale, apiurl, ipaddress, dateNow) {
        try {
            var urlInfo = apiurl + "/v1/control_files/" + file + "/control_types/" + type + "/controls?locale=" + locale;


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
                        logger.logAPIData(dateNow, ipaddress, locale, "GetControlData", urlInfo, " ", result.statusCode, "GET").then((sucess) => {})
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
                        logger.logAPIData(dateNow, ipaddress, locale, "GetControlData", urlInfo, err, statusCode, "GET").then((sucess) => {})
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

    GetLocationInformation(loc, locale, apiurl, ipaddress, dateNow) {

        try {

             if (locale == "") locale = "cn-en-ca";
            if (loc == 0) loc = 370;
            if (loc == 199) loc = 191;
            if (loc == 499) loc = 491;
            if (loc == 951) loc = 971;
            if (loc == 117) loc = 191;
	    if (loc == 430) loc = 491;		
	    if (loc == 638) loc = 971;

	    console.log(loc + "Loc");
	    console.log(locale + "Locale");

            var urlInfo = apiurl + "/v1/locations/"+ loc +"?locale=" + locale;
            //var urlInfo = apiurl + "/v1/locations/370?locale=cn-en-ca";


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
                        logger.logAPIData(dateNow, ipaddress, locale, "GetLocationInformation", urlInfo, " ", result.statusCode, "GET").then((sucess) => {})
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

                        logger.logAPIData(dateNow, ipaddress, locale, "GetLocationInformation", urlInfo, err, statusCode, "GET").then((sucess) => {})
                            .catch((error) => {
                                console.log(error);
                            });
                    });
            });
            return promise;


        } catch (Exception) {
            console.log(err);
            return new Promise((resolve, reject) => {
                resolve({
                    statusCode: 417
                });
            });
        }
    }

    GetDeviceInfo(ipaddress, apiurl, dateNow) {
        try {

            var urlInfo = apiurl + "/v1/ping?ipAddress=" + ipaddress;            
            let promise = new Promise((resolve, reject) => {
                axios
                    .get(urlInfo, {
                        headers: {
                            'Authorization': "Bearer " + JSON.parse(token.GetTokenFromCache()).access_token
                        }
                    })
                    .then(res => {

                        let status = res.data.statusCode;
                        if (status == undefined) {
                            status = res.headers["crateapi-forwarded-status"];
                        }
                        logger.logAPIData(dateNow, ipaddress, "", "GetDeviceInfo", urlInfo, JSON.stringify(res.data), "200", "GET").then((sucess) => {})
                            .catch((error) => {
                                console.log(error);
                            });
                        resolve(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                        let statusCode = err.toString().substring(err.toString().length - 3);
                        resolve({
                            statusCode: isNaN(statusCode) ? 417 : parseInt(statusCode)
                        });
                        logger.logAPIData(dateNow, ipaddress, "", "GetDeviceInfo", urlInfo, err, statusCode, "GET").then((sucess) => {})
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

    GetIPAddress(req) {
        var ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return ipaddress;
    }
}

module.exports = new Common();