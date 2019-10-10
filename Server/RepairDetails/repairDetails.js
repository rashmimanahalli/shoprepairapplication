var request = require('sync-request');
var token = require('../TokenGeneration/token.js');
var logger = require('../../Server/Common/logger.js');
const axios = require('axios');

class RepairDetails {
  UnlockRepair(transactionID, apiURL, locale, ipaddress, dateNow) {
    var urlInfo;

    try {
      var content = {
        "transactionID": transactionID,
        "ipAddress": ipaddress
      };
      urlInfo = apiURL + "/v1/inventory_adjustments/pending_adjustments/unlock?locale=" + locale;

      

      let promise = new Promise((resolve, reject) => {
        axios
          .post(urlInfo, content, {
            headers: {
              'Accept': 'text/json',
              'Authorization': "Bearer " + JSON.parse(token.GetTokenFromCache()).access_token,
              'Cache-Control': 'no-cache',
              'content-type': 'application/json'
            },

          })
          .then(res => {            
            let status = res.data.statusCode;
            if (status == undefined) {
              status = res.headers["crateapi-forwarded-status"];
            }
            let result ={statusCode: res.status , body: res.data};
            logger.logAPIData(dateNow, ipaddress, locale, "UnlockRepair", urlInfo + ":" + transactionID, JSON.stringify(res.data), result.statusCode, "GET").then((sucess) => {})
              .catch((error) => {
                console.log(error);
              });
            resolve(result);
          })
          .catch(err => {
            console.log(err);
            let statusCode = err.toString().substring(err.toString().length - 3);
            resolve({ statusCode: isNaN(statusCode) ? 417 : parseInt(statusCode) });
            logger.logAPIData(dateNow, ipaddress, locale, "UnlockRepair", urlInfo, err, statusCode, "GET").then((sucess) => {})
              .catch((error) => {
                console.log(error);
              });
          });
      });
      return promise;

    } catch (error) {
      console.log("error" + error);
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 417
        });
      });
    }
  }

  UpdateRepairDetails(jsonData, repairNumber, locale, apiURl, ipaddress, dateNow) {
    try {
      var urlInfo = apiURl + "/v1/repairs/" + repairNumber + "?locale=" + locale;

      console.log(JSON.stringify(jsonData));
      jsonData.ipAddress = ipaddress;
      const options = {
        method: 'post',
        headers: {
          'Accept': 'text/json',
          'Authorization': "Bearer " + JSON.parse(token.GetTokenFromCache()).access_token,
          'Cache-Control': 'no-cache',
          'content-type': 'application/json'
        },
        data: JSON.stringify(jsonData),
        url: urlInfo
      };
      let promise = new Promise((resolve, reject) => {
        axios(options)
          .then(res => {            
            let status = res.data.statusCode;
            if (status == undefined) {
              status = res.headers["crateapi-forwarded-status"];
            }            
            logger.logAPIData(dateNow, ipaddress, locale, "UpdateRepairDetails", urlInfo, JSON.stringify(jsonData) +"::"+ JSON.stringify(res.data), status, "POST").then((sucess) => {})
              .catch((error) => {
                console.log(error);
              });            
            resolve(res.data.repairNumber);
          })
          .catch(err => {            
            console.log(err);
            logger.logAPIData(dateNow, ipaddress, locale, "UpdateRepairDetails", urlInfo, err, "", "POST").then((sucess) => {})
              .catch((error) => {
                console.log(error);
              });
            resolve("0");
            // return new Promise((resolve, reject) => {
            //   resolve(0);
            // });
          });
      });
      return promise;

    } catch (err) {      
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 417
        });
      });

    }
  }
}

module.exports = new RepairDetails();