var express = require('express');
var app = express();
var bodyParser = require("body-parser"),
  formidable = require('formidable'),
  path = require('path'),
  async = require('async'),
    fs = require('fs'),
    Quagga = require('quagga').default;

var jsonParser = bodyParser.json();
var t = require('events').EventEmitter.prototype._maxListeners = 100;
var maxworkers = require('os').cpus().length;
var configData = fs.readFileSync('../public/Config/configuration.json');
var nodeServerPORT = JSON.parse(configData).NodeServerPort;
var nodeServerURL = JSON.parse(configData).NodeServerURL;
var goAPiURL = JSON.parse(configData).GOLANGAPI;
var goLangApiURLRC = JSON.parse(configData).GOLANGAPIURL_1;
var goLangUnlockURL = JSON.parse(configData).GOLANG_UNLOCKURL;
var enableLogging = JSON.parse(configData).EnableLogging;
var storeID = "";

var skuData = require('./SKUToken/app');
var logger = require('./Common/logger.js');
var gUpload = require('./googleUpload/googleUpload.js');
var repairCodeData = require('./RepairCode/repairCode.js');
var common = require('./Common/Common.js');
var validation = require('./Common/validation.js');
var repairSearch = require('./RepairSearch/repairSearch.js');
var updateRepair = require('./RepairDetails/repairDetails.js');
var _dirName = '../TempImages/Upload/';
var _dirResize = '../TempImages/Resized/';
var _dirErrorUpload = '../TempImages/ErrorUpload';
var _dirErrorResize = '../TempImages/ErrorResize';
var UID;
var vendorName = '';
var skuName = '';
var vendorFullName = '';
var screenType = "";
var repairNumber = "";

//START- Server Initialization
app.use(jsonParser);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser({
  limit: '50mb'
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(nodeServerPORT, function () {});

//END- Server Initialization

//START-- COMMON functions

//START -- GET CONTROL VALUES
app.post('/GetControlData', function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

  var file = req.body.file.toString();
  var type = req.body.type.toString();
  var locale = req.body.locale.toString();
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }

  var nowdate = new Date();
  common.GetControlData(file, type, locale, goAPiURL, ipaddress, nowdate)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(417).send(error);
    });
});
//END -- GET CONTROL VALUES


//START-- Get SKU Details
app.post('/GetSKUDetails', function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  var sku = req.body.sku.toString();
  var locale = req.body.locale.toString();
  var effectivedate = req.body.effectivedate.toString();
  var nowdate = new Date();
  skuData.GetSKUDetails(sku, locale, effectivedate, ipaddress, nowdate)
    .then((result) => {
      vendorName = result.body.itemDetail.vendorID;
      vendorFullName = result.body.itemDetail.vendorName;
      skuName = sku;
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(417).send(error);
    });

});
//END-- Get SKU Details


//START- GET IP ADDRESS
app.post('/GetIPAddress', function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  res.status(200).send(ip);
});
//END- GET IP ADDRESS

//START -- GET LOCATION DETAILS
app.post('/GetLocationInformation', function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  var nowdate = new Date();
  common.GetDeviceInfo(ip, goAPiURL, nowdate)
    .then((result) => {
      console.log(ip);
      if (ip == "10.100.10.99") {
        storeID = 191;
      } else {
        storeID = result.StoreID;
      }
      console.log(storeID);
      common.GetLocationInformation(storeID, result.Locale, goAPiURL, ipaddress, nowdate)
        .then((result) => {
          res.status(200).send(result);
        }).catch((error) => {
          console.log(error);
          res.status(417).send(error);
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(417).send(error);
    });
});
//END -- GET LOCATION DETAILS

//END-- COMMON functions

//START -- dRIVE related functions

// //START--Upload to Google Drive
// app.post('/uploadGoogleDrive', function (req, res) {
//   var form = new formidable.IncomingForm();
//   var UID = gUpload.generateUUID();
//   if (!fs.existsSync(_dirName + '/' + UID)) {
//     fs.mkdirSync(_dirName + '/' + UID);
//     form.uploadDir = _dirName + '/' + UID;
//   }
//   if (!fs.existsSync(_dirResize + '/' + UID)) {
//     fs.mkdirSync(_dirResize + '/' + UID);
//   }
//   form.parse(req).on('file', function (name, file) {
//       var sourceFile = fs.createReadStream(file.path);
//       var destFile = fs.createWriteStream(path.join(path.join(_dirResize, UID), file.name));
//       sourceFile.pipe(destFile);

//       sourceFile.on('end', function () {
//         gUpload.imageResize(path.join(path.join(_dirResize, UID), file.name), repairNumber);
//       });
//     })
//     .on('end', function () {
//       var result = gUpload._googleDriveHandler(vendorName, vendorFullName, skuName, UID);
//       result.then(function (data) {

//         res.send(200);
//       }, function (err) {
//         res.send(900);
//       });
//     });
// });
// //END--Upload to Google Drive

//START--Upload to Google Drive
app.post('/uploadGoogleDrive/:rprNumber/sku/:sku/vendorID/:id/name/:name', function (req, res) {

  var repairNumber = req.params.rprNumber;
  var skuName = req.params.sku;
  var vendorName = req.params.id;
  var vendorFullName = req.params.name;
  console.log("vendorID : " + vendorName);
  console.log("vendorFull : " + vendorFullName);
  console.log("skuNames : " + skuName);
  var ipaddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
  if (ipaddress) {
    ipaddress = ipaddress.split(',')[0];
  }
  //console.log(repairNumber);
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  var form = new formidable.IncomingForm();
  var UID = gUpload.generateUUID();
  if (!fs.existsSync(_dirName + '/' + UID)) {
    fs.mkdirSync(_dirName + '/' + UID);
    form.uploadDir = _dirName + '/' + UID;
  }
  if (!fs.existsSync(_dirResize + '/' + UID)) {
    fs.mkdirSync(_dirResize + '/' + UID);
  }
  form.parse(req).on('file', function (name, file) {
      var nowdate = new Date();
      if (enableLogging) {
        logger.logData(ipaddress, file.name.substring(0, 9), skuName, "Image Upload", vendorName, nowdate, "SUCCESS").then((sucess) => {

          })
          .catch((error) => {
            console.log(error);
          });
      }
      var sourceFile = fs.createReadStream(file.path);
      var extension = file.name.substring(file.name.length - 4, file.name.length);
      logger.logData(ipaddress, file.name.substring(0, 9) + "Extension is- " + extension, skuName, "Image Rename for multiple files same name", vendorName, nowdate, "SUCCESS").then((sucess) => {

        })
        .catch((error) => {
          console.log(error);
        });
      var replacedName = file.name.replace(extension, "_" + gUpload.generateRandom() + extension);
      logger.logData(ipaddress, file.name.substring(0, 9) + "Replaced Image name - " + replacedName, skuName, "Image Rename for multiple files same name", vendorName, nowdate, "SUCCESS").then((sucess) => {

        })
        .catch((error) => {
          console.log(error);
        });
      var destFile = fs.createWriteStream(path.join(path.join(_dirResize, UID), replacedName));
      sourceFile.pipe(destFile);
      sourceFile.on('end', function () {
        logger.logData(ipaddress, file.name.substring(0, 9), skuName, "Image Upload", vendorName, nowdate, "SUCCESS")
          .then((sucess) => {

          })
          .catch((error) => {
            console.log(error);
          });
        logger.logCountData(ipaddress, file.name, skuName, "IMAGE UPLOADED BY USER", vendorName, nowdate, "SUCCESS").then((sucess) => {})
          .catch((error) => {
            console.log(error);
          });
        if (file.name.substring(0, 9).includes("Repair#")) {
          gUpload.imageResize(path.join(path.join(_dirResize, UID), replacedName), ipaddress, skuName, repairNumber, vendorName, nowdate);
        } else {
          gUpload.imageResize(path.join(path.join(_dirResize, UID), replacedName), ipaddress, skuName, file.name.substring(0, 9), vendorName, nowdate);
        }

      });
    })
    .on('end', function () {
      var result = gUpload._googleDriveHandler(vendorName, vendorFullName, skuName, UID, ipaddress);
      result.then(function (data) {
        res.send('completed');
      }, function (err) {
        res.send('Error');
      });

    });
});
//END--Upload to Google Drive

//START--Searches for  files related to R# in Google Drive and removes it
app.post('/searchFile', function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  console.log(ipaddress);
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  console.log(ipaddress);
  var nowdate = new Date();
  var vendorId = JSON.parse(req.body.searchData).vendor;
  var sku = JSON.parse(req.body.searchData).sku.toString();
  var locale = JSON.parse(req.body.searchData).locale.toString();
  var repairNumber = JSON.parse(req.body.searchData).repair.toString();
  updateRepair.UpdateRepairDetails(JSON.parse(req.body.repairData), repairNumber, locale, goLangApiURLRC, ipaddress, nowdate)
    .then((result) => {
      var resp = gUpload.searchFile(vendorId, sku, repairNumber, ipaddress, nowdate);
      res.status(200).send(result);
      resp.then(function (data) {
        //      res.status(200).send(result);
      }, function (err) {
        //    res.send(900);
      });

    })
    .catch((error) => {
      console.log(error);
      res.status(417).send(error);
    });

});
//END--Searches for  files related to R# in Google Drive and removes it

//END -- dRIVE related functions

//START -- as400 Repair# UPDATE and unlock

//START- update Repair data
app.post('/updateRepairData/:rprNumber/type/:type/locale/:locale', function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  var nowdate = new Date();
  screenType = req.params.type;
  repairNumber = req.params.rprNumber;
  locale = req.params.locale;
  updateRepair.UpdateRepairDetails(JSON.parse(req.body.repairDetailsJSON), repairNumber, locale, goLangApiURLRC, ipaddress, nowdate)
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(417).send(error);
    });
});
//END- update Repair data

//START -- UNLOCK repairNumber
app.post('/unlockRepair', function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  //console.log("Unlock Repair" + ipaddress);
  var nowdate = new Date();
  updateRepair.UnlockRepair(req.body.repairNumber, goLangUnlockURL, req.body.locale, ipaddress, nowdate)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(417).send(error);
    });
});
//END -- UNLOCK repairNumber

//END   -- as400 Repair# UPDATE and unlock

//START-- Shop Repair Application related functions -- GETs

//START-- GET REPAIR CODES
app.post('/GetRepairCodes', function (req, res) {
  var locale = req.body.locale.toString();
  var dept = req.body.dept.toString();
  var skuclass = req.body.skuclass.toString();
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  var nowdate = new Date();
  repairCodeData.GetRepairCodes(locale, dept, skuclass, goLangApiURLRC, ipaddress, nowdate)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(417).send(error);
    });
});
//END-- GET REPAIR CODES

// START -- GET REPAIR CODE DETAILS BY REPAIR NUMBER
app.post('/GetRepairCodeDetailsbyRepairNumber', function (req, res) {
  var repairNum = req.body.repairNum.toString();
  var location = req.body.location.toString();
  var locale = req.body.locale.toString();
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  var nowdate = new Date();
  repairCodeData.GetRepairCodeDetailsbyRepairNumber(repairNum, location, locale, goLangApiURLRC, ipaddress, nowdate)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(417).send(error);
    });
});

// END  -- GET REPAIR CODE DETAILS BY REPAIR NUMBER


//START-- GET REPAIR PERSONS
app.post('/GetRepairPersons', function (req, res) {
  var locale = req.body.locale.toString();
  var location = req.body.location.toString();
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  var nowdate = new Date();
  common.GetRepairPersons(locale, location, goLangApiURLRC, ipaddress, nowdate)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(417).send(error);
    });
});
//END-- GET REPAIR PERSONS



//START -- GET REPAIR SEARCH DETAILS
app.post('/GetRepairSearchDetails', function (req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }

  var nowdate = new Date();
  repairSearch.GetRepairSearchDetails(req.body, goLangApiURLRC, ipaddress, nowdate)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(417).send(error);
    });

});
//END -- GET REPAIR SEARCH DETAILS

//END-- Shop Repair Application related functions -- GETs


//START-- VALIDATION optional fields

//START-- VALIDATE DATA
app.post('/ValidateData', function (req, res) {
  var locale = req.body.locale.toString();
  var location = req.body.location.toString();
  var po = req.body.PurchaseOrder.toString();
  var salesNum = req.body.Sales.toString();
  var srcLoc = req.body.SourceLocation.toString();
  var sfx = req.body.Suffix.toString();
  var sku = req.body.sku.toString();
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  var ipaddress = ip;
  if (ip) {
    ipaddress = ip.split(',')[0];
  }
  if (ipaddress.substr(0, 7) == "::ffff:") {
    ipaddress = ipaddress.substr(7);
  }
  var nowdate = new Date();
  validation.ValidateData(locale, location, po, salesNum, sfx, srcLoc, sku, goLangApiURLRC, ipaddress, nowdate)
    .then((result) => {
      //console.log(JSON.stringify(result));
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(417).send(error);
    });
});
//END--  VALIDATE DATAS

//END-- VALIDATION optional fields



//START-- Copy Errored Files to Error Folder
app.post('/copyFiles/:location/repair_person/:repairPerson', function (req, res) {
  var location = req.params.location;
  var repairPerson = req.params.repairPerson;
  var ipaddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
  if (ipaddress) {
    ipaddress = ipaddress.split(',')[0];
  }
  var form = new formidable.IncomingForm();
  if (!fs.existsSync(_dirErrorUpload)) {
    fs.mkdirSync(_dirErrorUpload);
    form.uploadDir = _dirErrorUpload;
  }
  if (!fs.existsSync(_dirErrorResize)) {
    fs.mkdirSync(_dirErrorResize);
  }
  res.send('completed');
  form.parse(req).on('file', function (name, file) {
      var nowdate = new Date();
      if (enableLogging) {
        logger.logData(ipaddress, file.name.substring(0, 9), skuName, "Image Upload", vendorName, nowdate, "SUCCESS").then((sucess) => {

          })
          .catch((error) => {
            console.log(error);
          });
      }
      var sourceFile = fs.createReadStream(file.path);
      var extension = file.name.substring(file.name.length - 4, file.name.length);
      logger.logData(ipaddress, file.name.substring(0, 9) + "Extension is- " + extension, skuName, "Image Rename for multiple files same name", vendorName, nowdate, "SUCCESS").then((sucess) => {

        })
        .catch((error) => {
          console.log(error);
        });
      var replacedName = file.name.replace(extension, "_" + gUpload.generateRandom() + extension);
      replacedName = location + "_" + repairPerson + replacedName;
      logger.logData(ipaddress, file.name.substring(0, 9) + "Replaced Image name - " + replacedName, skuName, "Image Rename for multiple files same name", vendorName, nowdate, "SUCCESS").then((sucess) => {

        })
        .catch((error) => {
          console.log(error);
        });
      var destFile = fs.createWriteStream(path.join(path.join(_dirErrorResize), replacedName));
      sourceFile.pipe(destFile);
      sourceFile.on('end', function () {
        logger.logData(ipaddress, file.name.substring(0, 9), skuName, "Image Upload", vendorName, nowdate, "SUCCESS")
          .then((sucess) => {

          })
          .catch((error) => {
            console.log(error);
          });
        logger.logCountData(ipaddress, file.name, skuName, "IMAGE UPLOADED BY USER", vendorName, nowdate, "SUCCESS").then((sucess) => {})
          .catch((error) => {
            console.log(error);
          });
        gUpload.imageResize(path.join(path.join(_dirErrorResize), replacedName), ipaddress, skuName, repairNumber, vendorName, nowdate);
      });
    })
    .on('end', function () {

    });
});
//END-- Copy Errored Files to Error Folder