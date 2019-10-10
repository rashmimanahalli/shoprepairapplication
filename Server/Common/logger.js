var fs = require('fs');
//var cacheReaderFunction = require('./dataCache.js');
///var configData = fs.readFileSync('../Config/configuration.json');
var common = require("./Common.js");
var configData = fs.readFileSync('../public/Config/configuration.json');
var goAPiURL = JSON.parse(configData).GOLANGAPI;



function logData(ipaddress, repairnumber, sku, action, vendor, datenow, errorString) {
    let promise = new Promise((resolve, reject) => {
        var logStream = fs.createWriteStream('./Logs/log.csv', {
            'flags': 'a'
        });
        var location = "";
       
        console.log(ipaddress);
        //Date, Action, Location, IPAddress, Repair Number, SKU, Vendor
        var logString = datenow + " , " + action + " , " + "" + " , " + ipaddress + " , " + repairnumber + " , " + sku + " , " + vendor + ", " + errorString + "\n";
        logStream.write(logString);
        logStream.end();
    });
    return promise;
}

function logCountData(ipaddress, repairnumber, sku, action, vendor, datenow) {
    let promise = new Promise((resolve, reject) => {
        resolve({
            statusCode: 200
        });
        var logStream = fs.createWriteStream('./Logs/count.csv', {
            'flags': 'a'
        });
      
        //Date, Action, Location, IPAddress, Repair Number, SKU, Vendor
        var logString = datenow + ", " + repairnumber + ", " + vendor + ", " + sku + ", " + "" + ", " + action + "\n";
        logStream.write(logString);
        logStream.end();

    });
    return promise;
}

function logAPIData(dateNow, ipaddress, locale, APIFunctionName, request, requestBody, statusCode,type) {    
    let promise = new Promise((resolve, reject) => {
        //resolve({ statusCode : 200});
        var logStream = fs.createWriteStream('./Logs/apiAudit.csv', {
            'flags': 'a'
        });
        var location = "";
             
        var logString = "";
        logString += type;
        logString += ",";
        logString += dateNow;
        logString += ",";
        logString += ipaddress;
        logString += ",";
        logString += "";
        logString += ",";
        logString += locale;
        logString += ",";
        logString += APIFunctionName;
        logString += ",";
        logString += request;
        logString += ",";
        logString += requestBody;
        logString += ",";
        logString += statusCode;
        logString += "\n";
        //Date, Action, Location, IPAddress, Repair Number, SKU, Vendor
        //var logString = datenow + ", " + repairnumber + ", " + vendor + ", " + sku + ", " + location + ", " + action + "\n"
        logStream.write(logString);
        logStream.end();

    });
    return promise;
}


exports.logData = function (ipaddress, repairnumber, sku, action, vendor, datenow, errorString) {
    return logData(ipaddress, repairnumber, sku, action, vendor, datenow, errorString);
};

exports.logCountData = function (ipaddress, repairnumber, sku, action, vendor, datenow) {
    return logCountData(ipaddress, repairnumber, sku, action, vendor, datenow);
};

exports.logAPIData = function (dateNow, ipaddress, locale, APIFunctionName, request, requestBody, statusCode, apiType) {
    return logAPIData(dateNow, ipaddress, locale, APIFunctionName, request, requestBody, statusCode,apiType);
};