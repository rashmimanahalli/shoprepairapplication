var request = require('sync-request');
var token = require('../TokenGeneration/token.js');
var logger = require('../../Server/Common/logger.js');
const axios = require('axios');

// function GetRepairSearchDetails(locale, location, sku, status, repairDate, repairNumber, repairPerson,apiurl,tokenData,ipaddress,dateNow){
//  try{

//     var url = apiurl +"/v1/repairs?locale="+locale+"&loc="+location


//     if(status != '' && status != null && status != 0)  {
//         url = url + "&status=" +status;
//     }
//     if(repairDate != '' && repairDate != 00000000)  {
//         url = url + "&date="+ repairDate;
//     }
//     if(repairNumber != '') {
//         url = url + "&repairno="+ repairNumber;
//     }

//     if(repairPerson == '' && repairPerson != null && repairPerson != 0)  {
//         url = url + "&prsnid="+ repairPerson 
//     }
//     if (sku != '' && sku != 0 && sku != null){
//         url = url + "&sku="+sku 
//     }


//     var authInfo = "Bearer " + JSON.parse(tokenData).access_token ;
//     var headerInfo = {
//         'Authorization': authInfo
//     };

//     var response = request("GET", url, { headers: headerInfo, body: null });
//     logger.logAPIData(dateNow, ipaddress, locale, "GetRepairSearchDetails", url, " ", JSON.parse(response.getBody('utf8')).statusCode, "GET").then((sucess) => {})
//             .catch((error) => {
//                 console.log(error);
//             });
//     return response.getBody('utf8');
//  }
//  catch(err)
//  {
//      throw err;
//  }
// }

// exports.GetRepairSearchDetails = function (data, url, ipaddress,nowdate){
//     var result = "";
//     try
//     {
//         var tokenData= token.GetTokenFromCache();
//         result =  GetRepairSearchDetails(data.locale, data.location,data.sku,data.status,data.repairDate,data.repairNumber,data.repairPerson,url,tokenData,ipaddress,nowdate);
//     }
//     catch (Exception) {
//         if (Exception.statusCode == 401) {
//           token.GenerateToken();
//           result = GetRepairSearchDetails(data.locale, data.location,data.sku,data.status,data.repairDate,data.repairNumber,data.repairPerson,url,tokenData,ipaddress,nowdate);
//         }
//         else if (Exception.statusCode == 400) {
//             return Exception;
//         }
//     }
//     return result;

// };

class RepairSearch {

    GetRepairSearchDetails(data,apiurl, ipaddress, dateNow) {

        try {

            var urlInfo = apiurl + "/v1/repairs?locale=" + data.locale + "&loc=" + data.location;


            if (data.status != '' && data.status != null && data.status != 0) {
                urlInfo = urlInfo + "&status=" + data.status;
            }
            if (data.repairDate != '' && data.repairDate != "00000000") {
                urlInfo = urlInfo + "&date=" + data.repairDate;
            }
            if (data.repairNumber != '') {
                urlInfo = urlInfo + "&repairno=" + data.repairNumber;
            }

            if (data.repairPerson != '' && data.repairPerson != null && data.repairPerson != 0) {
                urlInfo = urlInfo + "&prsnid=" + data.repairPerson;
            }
            if (data.sku != '' && data.sku != 0 && data.sku != null) {
                urlInfo = urlInfo + "&sku=" + data.sku;
            }

            
            
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
                        if (status == undefined){
                            status = res.headers["crateapi-forwarded-status"];
                        }
                        console.log(res.headers["crateapi-forwarded-status"]);
                        let result = { statusCode: res.status, body: res.data , crateStatus :res.headers["crateapi-forwarded-status"] };
                        logger.logAPIData(dateNow, ipaddress, data.locale, "GetRepairSearchDetails", urlInfo, " ", result.statusCode, "GET").then((sucess) => {})
                        .catch((error) => {
                            console.log(error);
                        });				
                        resolve(result);	
                    })
                    .catch(err => {		
                        console.log(err);
                        let statusCode = err.toString().substring(err.toString().length - 3);
                        resolve({ statusCode: isNaN(statusCode) ? 417 : parseInt(statusCode) });
                        logger.logAPIData(dateNow, ipaddress, data.locale, "GetRepairSearchDetails", urlInfo, err, statusCode, "GET").then((sucess) => {})
                        .catch((error) => {
                            console.log(error);
                        });									                    
                    });
            });
            return promise;     
           
        } catch (err) {
            console.log(err);
            return new Promise((resolve, reject) => { resolve({ statusCode: 417 }); });
        }
    }
}
module.exports = new RepairSearch();