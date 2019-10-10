var fs = require('fs');
//var Jimp = require("jimp");
var datetime = require('node-datetime');
var configData = fs.readFileSync('../public/Config/configuration.json');
var _dirName = '../TempImages/Upload/';
var _dirResize = '../TempImages/Resized/';
var enableLogging = JSON.parse(configData).EnableLogging;
const Jimp = require("jimp");
var logger = require('../Common/logger.js');
// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}


const CLIENT_ID = JSON.parse(configData).CLIENT_ID;
const CLIENT_SECRET = JSON.parse(configData).CLIENT_SECRET;
const REFRESH_TOKEN = JSON.parse(configData).REFRESH_TOKEN;
const MAIN_FOLDER_ID = JSON.parse(configData).MAIN_FOLDER_ID;
const EmailID = JSON.parse(configData).EmailID;
const EmailPassword = decrypt(JSON.parse(configData).EmailPassword);
const EmailSubject = JSON.parse(configData).EmailSubject;
const EmailBody = JSON.parse(configData).EmailBody;
const ToEmailID = JSON.parse(configData).ToEmailID;
var ResizedImage_Width = JSON.parse(configData).ResizedImage_Width;
var ResizedImage_Height = JSON.parse(configData).ResizedImage_Height;
var ResizedImage_Quality = JSON.parse(configData).ResizedImage_Quality;

function imageResize(imageName, ipaddress, skuName, repairnumber, vendorName, nowdate) {

    var newFileName = imageName;
    if (imageName.includes("Repair#")) {
        newFileName = imageName.replace(/Repair#/g, repairnumber);
    }
    fs.renameSync(imageName, newFileName, function (err) {});

    Jimp.read(newFileName)
        .then(lenna => {
            lenna.resize(ResizedImage_Width, ResizedImage_Height) // resize
                .quality(ResizedImage_Quality) // set JPEG quality        
                .write(newFileName); // save
            logger.logData(ipaddress, "ImageName : " + imageName, skuName, "Image Resize Success", vendorName, nowdate, "Success").then((sucess) => {

                })
                .catch((error) => {
                    console.log(error);
                });
        }).catch(err => {
            if (err) {
                logger.logData(ipaddress, "ImageName : " + imageName, skuName, "Image Resize Error", vendorName, nowdate, err).then((sucess) => {})
                    .catch((error) => {
                        console.log(error);
                    });
                console.log(err);
            }
        });

}


function renameFile(filename, repairNum) {
    var fs = require('fs');

    var newFileName = filename.replace(/Repair#/g, repairNum);

    fs.renameSync(filename, newFileName, function (err) {
        var lenna = new Jimp(imageName, function () {
            this.resize(ResizedImage_Width, ResizedImage_Height) // resize
                .quality(ResizedImage_Quality) // set JPEG quality
                .write(imageName); // save
        });
    });
}

var deletFolderD = function (dir, repairNumber, ipaddress, SkuName, VendorName, nowdate, whichFolder) {
    var path = require("path");
    var fs = require("fs");
    var list = fs.readdirSync(dir);
    for (var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if (filename == "." || filename == "..") {
            // pass these files
        } else if (stat.isDirectory()) {
            // rmdir recursively        
            rmdir(filename);
            logger.logData(ipaddress, repairNumber + "-" + dir + "- Temp Images " + whichFolder + " folder was deleted successfully and synchronously ", SkuName, "Temp Images Folder Delete", VendorName, nowdate, "Success");
        } else {
            // rm fiilename

            fs.unlinkSync(filename);
            logger.logData(ipaddress, repairNumber + "-" + filename + "- Temp Images " + whichFolder + " File was deleted successfully and synchronously ", SkuName, "Temp Images File Delete", VendorName, nowdate, "Success");
        }
    }
    fs.rmdirSync(dir);
    logger.logData(ipaddress, repairNumber + "-" + dir + "- Temp Images " + whichFolder + " folder was deleted successfully and synchronously ", SkuName, "Temp Images Folder Delete", VendorName, nowdate, "Success");
};

function sendEmail(vendorName, vendorFullName) {
    var mailer = require("nodemailer");
    var smtpTransport1 = require('nodemailer-smtp-transport');
    // Use Smtp Protocol to send Email
    var smtpTransport = mailer.createTransport("SMTP", {
        //service: "Gmail",
        host: "smtp-relay.cb.crateandbarrel.com", // hostname
        port: 25, // port for secure SMTP
        // auth: {
        //     user: EmailID,
        //     pass: EmailPassword
        // }
    });
    var fs = require('fs');
    var mail = {
        from: EmailID,
        to: ToEmailID,
        subject: "Shop Repairs Photo folder",
        text: "Shop Repair Pictures image uploaded successfully",
        html: "<p>New folder has been created for vendor " + vendorName + " (" + vendorFullName + ").</p> <p>Please contact the vendor to provide view access to view their shop repair pictures.</p> <p>Please contact helpdesk if you have questions.</p>"
    };
    var nows = new Date();
    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            fs.appendFile('EmailLog.txt', nows + " :Email sending error:" + error, function (error) {
                if (error) {} else {}
            });
        } else {
            fs.writeFile('EmailLog.txt', nows + " :Email sending success: " + response.message, function (error) {
                if (error) {} else {}
            });
        }

        smtpTransport.close();
    });
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function generateRandom() {
    return Math.floor(100000 + Math.random() * 900000);
}


function _googleDriveHandler(VendorName, vendorFullName, SkuName, UID, ipaddress) {
    var nowdate = new Date();
    var Q = require('q');
    var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;
    var fileList = [];
    var vendorMatch = false;
    var skuMatch = false;
    var dirname = '../TempImages/Resized';
    var dirnameUpload = '../TempImages/Upload/';
    var async = require('async'),
        request = require('request'),
        fs = require('fs'),
        google = require('googleapis');
    var drive = google.drive('v3');
    var promise = require('promise');
    var deferred = Q.defer();
    var path = require('path');
    var errorOccured = false;
    return new Promise(function (fulfill, reject) {
        async.waterfall([
                function (callback) {
                    var tokenProvider = new GoogleTokenProvider({
                        'refresh_token': REFRESH_TOKEN,
                        'client_id': CLIENT_ID,
                        'client_secret': CLIENT_SECRET
                    });
                    // Obtain a new access token
                    tokenProvider.getToken(callback);
                },
                function (accessToken, fileData, callback) {

                    var SKU_FOLDER_ID = '';
                    var VENDOR_FOLDER_ID = '';
                    var vendorfileMetadata = {
                        'name': VendorName,
                        'mimeType': 'application/vnd.google-apps.folder',
                        'parents': [MAIN_FOLDER_ID]
                    };
                    var mainFolderMetaData = {
                        'mimeType': 'application/vnd.google-apps.folder and trashed',
                        'parents': [MAIN_FOLDER_ID]
                    };
                    //List the Files in the MAIN_FOLDER_ID
                    drive.files.list({
                        'q': '"' + MAIN_FOLDER_ID + '" in parents and trashed = false and name = "' + VendorName + '"',
                        //'pageSize': 100,
                        'headers': {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }, function (err, response) {
                        if (err) {
                            if (enableLogging) {
                                logger.logData(ipaddress, " ", SkuName, "Error while finding Vendor Folder :( ", VendorName, nowdate, err).then((sucess) => {

                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                            reject("Error");
                        } else {
                            var arrayFound = response.files.filter(function (item) {
                                if (item.name == VendorName) {
                                    VENDOR_FOLDER_ID = item.id;
                                    vendorMatch = true;
                                    return false;
                                }
                            });
                            if (vendorMatch) {
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "Vendor Folder Found :) ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                                skuExistsCheck();
                            } else {
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "Vendor Folder not found :( ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                                newVendor();

                            }
                        }
                    });


                    //Check for SKU folder exists or not
                    function skuExistsCheck() {
                        drive.files.list({
                            'q': '"' + VENDOR_FOLDER_ID + '" in parents and trashed = false and name = "' + SkuName + '"',
                            //'pageSize': 1000,
                            'headers': {
                                'Authorization': 'Bearer ' + accessToken
                            }
                        }, function (err, response) {
                            if (err) {
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "Error while finding SKU Folder :( ", VendorName, nowdate, err).then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                                reject("Error");
                            } else {
                                var skuFound = response.files.filter(function (item) {
                                    if (item.name == SkuName) {
                                        SKU_FOLDER_ID = item.id;
                                        skuMatch = true;
                                        return false;
                                    }
                                });
                                if (skuMatch) {
                                    if (enableLogging) {
                                        logger.logData(ipaddress, " ", SkuName, "SKU Folder found :) ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    }
                                    fileUpload(true, VendorName, SkuName, SKU_FOLDER_ID, vendorFullName);
                                } else {
                                    if (enableLogging) {
                                        logger.logData(ipaddress, " ", SkuName, "SKU Folder not found :( ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    }
                                    newSKU();
                                }
                            }
                        });

                    }

                    // Create a new vendor folder
                    function newVendor() {
                        drive.files.create({
                            resource: vendorfileMetadata,
                            'headers': {
                                'Authorization': 'Bearer ' + accessToken
                            }
                            //,fields: 'id'
                        }, function (err, file) {
                            if (err) {
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "Vendor Folder creation failed :( ", VendorName, nowdate, err).then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                                sendErrorEmail(vendorId, vendorFullName, sku, "");
                                reject("Error");
                            } else {
                                sendEmail(VendorName, vendorFullName, ipaddress, SkuName);
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "Vendor Folder created :) ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                                VENDOR_FOLDER_ID = file.id;
                                newSKU();
                            }
                        });
                    }


                    // Create a new sku folder
                    function newSKU() {
                        var skuFolderMetaData = {
                            'name': SkuName,
                            'mimeType': 'application/vnd.google-apps.folder',
                            'parents': [VENDOR_FOLDER_ID]
                        };
                        drive.files.create({
                            resource: skuFolderMetaData,
                            'headers': {
                                //'Authorization': 'Bearer '
                                'Authorization': 'Bearer ' + accessToken
                            }
                        }, function (err, file) {
                            if (err) {
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "SKU Folder creation failed :( ", VendorName, nowdate, err).then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                            } else {
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "SKU Folder created :)   ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                                SKU_FOLDER_ID = file.id;
                                fileUpload(true, VendorName, SkuName, SKU_FOLDER_ID, vendorFullName);
                            }
                        });
                    }

                    //Upload Image in the Errored folder
                    function createErrorFolder() {
                        // var nowDate = new Date();
                        // var skuFolderMetaData = {
                        //   'name': VendorName + "_" + SkuName + "_" + RepairNumber + "_" + nowDate.getFullYear() + "" + (nowDate.getMonth() + 1) + "" + nowDate.getDate() + "" + nowDate.getHours() + "" + nowDate.getMinutes() + "" + nowDate.getSeconds(),
                        //   'mimeType': 'application/vnd.google-apps.folder',
                        //   'parents': [ERRORED_FOLDER_ID]
                        // }
                        // drive.files.create({
                        //   resource: skuFolderMetaData,
                        //   'headers': {
                        //     //'Authorization': 'Bearer '
                        //     'Authorization': 'Bearer ' + accessToken
                        //   }
                        // }, function (err, file) {
                        //   if (err) {              
                        //     sendErrorEmail(VendorName, vendorFullName, SkuName);
                        //   } else {
                        //     SKU_FOLDER_ID = file.id;
                        //     fileUpload(false,ERRORED_FOLDER_ID);
                        //   }
                        // });
                        fileUpload(false, VendorName, SkuName, ERRORED_FOLDER_ID, vendorFullName);
                        if (errorOccured) {
                            sendErrorEmail(vendorId, vendorFullName, sku, "");
                            reject("Error Uploading");
                        } else {
                            reject("Error Uploading");
                        }

                    }

                    //Sends email if upload fails in the Errored Folder
                    function sendErrorEmail(VendorName, vendorFullName, sku, filename) {
                        try {
                            var mail = {};
                            var nows = new Date();
                            //var attachments = [];
                            var mailer = require("nodemailer");
                            var smtpTransport1 = require('nodemailer-smtp-transport');
                            // Use Smtp Protocol to send Email
                            var smtpTransport = mailer.createTransport("SMTP", {
                                //service: "gmail",
                                host: "smtp-relay.cb.crateandbarrel.com", // hostname
                                port: 25, // port for secure SMTP
                                // auth: {
                                //   user: EmailID,
                                //   pass: EmailPassword
                                // }
                            });
                            var fs = require('fs');

                            if (filename != "") {


                                fs.readdir(path.join(dirname, UID), function (err, filenames) {
                                    var fileCOunt = filenames.length;
                                    var fileCounter = 0;
                                    //filenames.forEach(function (filename) {
                                    if (fs.existsSync(path.join(path.join(dirname, UID), filename))) {
                                        var fstatus = fs.statSync(path.join(path.join(dirname, UID), filename));
                                        fs.open(path.join(path.join(dirname, UID), filename), 'r', function (status, fileDescripter) {
                                            if (status) {
                                                callback(status.message);
                                                return;
                                            }
                                            var buffer = new Buffer(fstatus.size);
                                            fs.read(fileDescripter, buffer, 0, fstatus.size, 0, function (err, num) {
                                                mail = {
                                                    from: EmailID,
                                                    to: ToErrorEmailID,
                                                    subject: ErrorEmailSubject,
                                                    text: "Shop Repair Pictures image upload failed",
                                                    html: "<p>Attached images failed to upload for vendor " + VendorName + " (" + vendorFullName + ") and sku " + sku + ".</p> <p>Please contact helpdesk if you have questions.</p>",
                                                    attachments: [{
                                                        filename: filename,
                                                        contents: new Buffer(buffer, 'base64')
                                                    }]
                                                };
                                                smtpTransport.sendMail(mail, function (error, response) {
                                                    if (error) {
                                                        fs.appendFile('EmailLog.txt', nows + " :Email sending error:" + error, function (error) {
                                                            if (error) {} else {}
                                                        });
                                                    } else {
                                                        if (enableLogging) {
                                                            logger.logData(ipaddress, " ", SkuName, "Error Email Sent Success :) ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                });
                                                        }
                                                        fs.writeFile('EmailLog.txt', nows + " :Email sending success: " + response.message, function (error) {
                                                            if (error) {} else {}
                                                        });
                                                    }

                                                    smtpTransport.close();
                                                });
                                            });
                                        });
                                    }
                                    //});
                                });
                            } else {

                                mail = {
                                    from: EmailID,
                                    to: ToErrorEmailID,
                                    subject: ErrorEmailSubject,
                                    text: "Shop Repair Pictures image upload failed",
                                    html: "<p>Attached images failed to upload for vendor " + VendorName + " (" + vendorFullName + ") and sku " + sku + ".</p> <p>Please contact helpdesk if you have questions.</p>",
                                };

                                smtpTransport.sendMail(mail, function (error, response) {
                                    if (error) {
                                        fs.appendFile('EmailLog.txt', nows + " :Email sending error:" + error, function (error) {
                                            if (error) {} else {}
                                        });
                                    } else {
                                        if (enableLogging) {
                                            logger.logData(ipaddress, " ", SkuName, "Error Email Sent Success :) ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                });
                                        }
                                        fs.writeFile('EmailLog.txt', nows + " :Email sending success: " + response.message, function (error) {
                                            if (error) {} else {}
                                        });
                                    }

                                    smtpTransport.close();
                                });
                            }
                            reject("err");
                        } catch (e) {
                            console.log(e);
                            if (enableLogging) {
                                logger.logData(ipaddress, " ", SkuName, "Error Email Sent Failed :( ", VendorName, nowdate, e).then((sucess) => {

                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }

                        }

                        reject('Upload failed and email sent');

                    }

                    // Uploads Captured Image in SKU Folder or Errored Folder 
                    function fileUpload(normalUpload, vendorId, sku, folderID, vendorFullName) {
                        fs.readdir(path.join(dirname, UID), function (err, filenames) {
                            var fileCOunt = filenames.length;
                            var fileCounter = 0;
                            var tempFileName = "";
                            //async.eachSeries(filenames, function (filename) {
                            filenames.forEach(function (filename) {

                                if (fs.existsSync(path.join(path.join(dirname, UID), filename))) {
                                    var fstatus = fs.statSync(path.join(path.join(dirname, UID), filename));

                                    fs.open(path.join(path.join(dirname, UID), filename), 'r', function (status, fileDescripter) {
                                        var uploadedRepairNumber = filename.substring(0, 9);
                                        var uploadFileName = "";

                                        var randomname = filename.substring(filename.length - 11, filename.length);
                                        logger.logData(ipaddress, uploadedRepairNumber + "Replaced Random number in Image - " + randomname, SkuName, "Image Rename for multiple files same name", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                        var extension = filename.substring(filename.length - 4, filename.length);
                                        logger.logData(ipaddress, uploadedRepairNumber + "Replaced Image extension - " + extension, SkuName, "Image Rename for multiple files same name", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                        tempFileName = filename;
                                        filename = filename.replace(randomname, extension);
                                        logger.logData(ipaddress, uploadedRepairNumber + "Replaced Image name without random number- " + filename, SkuName, "Image Rename for multiple files same name", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });

                                        if (normalUpload) {
                                            uploadFileName = filename;
                                        } else {
                                            uploadFileName = vendorId + "_" + sku + "_" + filename;
                                        }
                                        if (status) {
                                            callback(status.message);
                                            return;
                                        }
                                        var buffer = new Buffer(fstatus.size);
                                        fs.read(fileDescripter, buffer, 0, fstatus.size, 0, function (err, num) {

                                            request.post({
                                                'url': 'https://www.googleapis.com/upload/drive/v2/files',
                                                'qs': {
                                                    'uploadType': 'multipart'
                                                },
                                                'headers': {
                                                    'Authorization': 'Bearer ' + accessToken
                                                },
                                                'multipart': [{
                                                        'Content-Type': 'application/json; charset=UTF-8',
                                                        'body': JSON.stringify({
                                                            'title': uploadFileName,
                                                            'parents': [{
                                                                'id': folderID
                                                            }]
                                                        })
                                                    },
                                                    {
                                                        'Content-Type': 'image/png',
                                                        'body': buffer
                                                    }
                                                ]
                                            }, function (err, res) {
                                                if (res.statusCode != 200) {
                                                    if (res.statusCode == 403) {
                                                        logger.logData(ipaddress, uploadedRepairNumber, SkuName, "403 Scenario: Image Upload failed :( ", VendorName, nowdate, err).then((sucess) => {})
                                                            .catch((error) => {
                                                                console.log(error);
                                                            });
                                                        postRequest(accessToken, folderID, uploadFileName, buffer);
                                                    } else {
                                                        if (enableLogging && !normalUpload) {
                                                            logger.logData(ipaddress, uploadedRepairNumber, SkuName, "Errored Folder File Uploaded failed :( ", VendorName, nowdate, err).then((sucess) => {

                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                });
                                                        } else {
                                                            logger.logData(ipaddress, uploadedRepairNumber, SkuName, "Image Upload failed :( ", VendorName, nowdate, err).then((sucess) => {

                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                });
                                                        }
                                                        logger.logCountData(ipaddress, uploadFileName, SkuName, "DRIVE UPLOAD FAILED", VendorName, nowdate).then((sucess) => {

                                                            })
                                                            .catch((error) => {
                                                                console.log(error);
                                                            });
                                                        errorOccured = true;
                                                        //createErrorFolder();
                                                        sendErrorEmail(vendorId, vendorFullName, sku, tempFileName);
                                                        reject('Error Ocuccuyed');
                                                    }
                                                } else {
                                                    //sendErrorEmail(vendorId, vendorFullName, sku, "");
                                                    if (!normalUpload) {
                                                        if (enableLogging) {
                                                            logger.logData(ipaddress, uploadedRepairNumber, SkuName, "File Upload in Errored Folder Success :) ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                });
                                                        }
                                                    } else {
                                                        if (enableLogging) {
                                                            logger.logCountData(ipaddress, uploadFileName, SkuName, "DRIVE UPLOAD SUCCESS", VendorName, nowdate).then((sucess) => {

                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                });
                                                            logger.logData(ipaddress, uploadedRepairNumber, SkuName, "File Upload Success :) ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                });
                                                        }
                                                    }
                                                    errorOccured = false;
                                                }
                                            });
                                        });
                                        fs.close(fileDescripter, function (e, r) {

                                            logger.logData(ipaddress, uploadedRepairNumber, SkuName, "File Closed ", VendorName, nowdate, "Success").then((sucess) => {

                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                });
                                        });
                                        fileCounter++;
                                        if (fileCounter == fileCOunt) {
                                            fulfill('Files Uploaded');
                                            deletFolderD(path.join(dirnameUpload, UID), uploadedRepairNumber, ipaddress, SkuName, VendorName, nowdate, "Upload");
                                            deletFolderD(path.join(dirname, UID), uploadedRepairNumber, ipaddress, SkuName, VendorName, nowdate, "Resize");
                                        }
                                    });
                                }
                            });
                        });
                    }

                    function postRequest(accessToken, folderID, uploadFileName, buffer) {
                        request.post({
                            'url': 'https://www.googleapis.com/upload/drive/v2/files',
                            'qs': {
                                'uploadType': 'multipart'
                            },
                            'headers': {
                                'Authorization': 'Bearer ' + accessToken
                            },
                            'multipart': [{
                                    'Content-Type': 'application/json; charset=UTF-8',
                                    'body': JSON.stringify({
                                        'title': uploadFileName,
                                        'parents': [{
                                            'id': folderID
                                        }]
                                    })
                                },
                                {
                                    'Content-Type': 'image/png',
                                    'body': buffer
                                }
                            ]
                        }, function (err, res, body) {
                            if (res.statusCode == 200) {
                                if (fs.existsSync(path.join(path.join(dirname, UID), uploadFileName))) {
                                    fs.unlinkSync(path.join(path.join(dirname, UID), uploadFileName), (err) => {
                                        skuData.logData(ipaddress, uploadedRepairNumber, SkuName, "File was deleted successfully and synchronously ", VendorName, nowdate, "Success");
                                    });
                                }
                            }
                        });
                    }
                },
                function (response, body, callback) {
                    callback(null, body);
                },

            ],
            function (err, results) {
                if (!err) {
                    res.status(200).send('processed successfully using async lib');
                }
            }
        );
    });

}


// function _googleDriveHandler(VendorName,vendorFullName,SkuName,UID){
//     var Q = require('q');
//     var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;
//     var fileList = [];
//     var vendorMatch = false;
//     var skuMatch = false;
//     var dirname = '../TempImages/Resized';
//     var dirnameUpload = '../TempImages/Upload/';
//     var async = require('async'),
//         request = require('request'),
//         fs = require('fs'),
//         google=require('googleapis');
//     var drive = google.drive('v3');
//     var promise = require('promise');
//     var deferred = Q.defer();
//     var path = require('path');
//     //return new Promise(function (response, reject){
//      return new Promise(function (fulfill, reject){
//         async.waterfall([
//           function(callback) {
//             var tokenProvider = new GoogleTokenProvider({
//               'refresh_token': REFRESH_TOKEN,
//               'client_id': CLIENT_ID,
//               'client_secret': CLIENT_SECRET
//             });
//             tokenProvider.getToken(callback);          },
//           function(accessToken,fileData,callback) {
//                 var SKU_FOLDER_ID = '';
//                 var VENDOR_FOLDER_ID = '';
//                 var vendorfileMetadata = {
//                   'name' : VendorName,
//                   'mimeType' : 'application/vnd.google-apps.folder',
//                   'parents': [ MAIN_FOLDER_ID ]
//                 };
//                 var mainFolderMetaData = {
//                   'mimeType' : 'application/vnd.google-apps.folder and trashed',
//                   'parents': [ MAIN_FOLDER_ID ]
//                 };
//                 drive.files.list({
//                     'q': '"'+MAIN_FOLDER_ID+'" in parents and trashed = false',
//                      'headers' : {
//                             'Authorization': 'Bearer ' + accessToken
//                      }
//                 }, function(err, response){
//                     if(err)
//                     {
//                     }
//                     else{
//                         var arrayFound = response.files.filter(function(item) {
//                             if(item.name == VendorName)
//                             {
//                                 VENDOR_FOLDER_ID = item.id;
//                                 vendorMatch = true;
//                                 return false;
//                             }
//                         });
//                         if(vendorMatch){
//                             skuExistsCheck();
//                         }
//                         else{
//                             newVendor();
//                             sendEmail(VendorName,vendorFullName);
//                         }
//                     }
//                 });
//                 //newVendor();
//                 function skuExistsCheck(){
//                       drive.files.list({
//                             'q': '"'+VENDOR_FOLDER_ID+'" in parents and trashed = false',
//                              'headers' : {
//                                     'Authorization': 'Bearer ' + accessToken
//                              }
//                         }, function(err, response){
//                             if(err)
//                             {
//                             }
//                             else{
//                                 var skuFound = response.files.filter(function(item) {
//                                     if(item.name == SkuName)
//                                     {
//                                          SKU_FOLDER_ID = item.id;
//                                          skuMatch = true;
//                                          return false;
//                                     }
//                                 });
//                                 if(skuMatch){
//                                     fileUpload();
//                                 }
//                                 else{
//                                     newSKU();
//                                 }
//                             }
//                     });

//                 }
//                 //Check for Vendor

//                 // For New Vendor
//                 function newVendor(){
//                       drive.files.create({
//                           resource: vendorfileMetadata,
//                           'headers' : {
//                             'Authorization': 'Bearer ' + accessToken
//                           }
//                           //,fields: 'id'
//                         }, function(err, file) {
//                           if(err) {
//                             next(err);
//                           } else {
//                               VENDOR_FOLDER_ID = file.id;
//                               newSKU();
//                           }
//                       });
//                 }


//                 // For New SKU
//                 function newSKU(){
//                      var skuFolderMetaData ={
//                       'name' : SkuName,
//                       'mimeType' : 'application/vnd.google-apps.folder',
//                       'parents': [ VENDOR_FOLDER_ID ]
//                     }
//                     drive.files.create({
//                       resource: skuFolderMetaData,
//                       'headers' : {
//                         'Authorization': 'Bearer ' + accessToken
//                       }
//                     }, function(err, file) {
//                       if(err) {
//                       } else {
//                         SKU_FOLDER_ID = file.id;
//                         fileUpload();
//                       }
//                     });
//                 }


//               // For New File
//                 function fileUpload(){
//                             fs.readdir(path.join(dirname,UID), function(err, filenames){
//                                 var fileCOunt = filenames.length ;
//                                 var fileCounter = 0;
//                                 filenames.forEach(function(filename) {
//                                         if (fs.existsSync(path.join(path.join(dirname,UID),filename)))
//                                         {
//                                             var fstatus = fs.statSync(path.join(path.join(dirname,UID),filename));
//                                             fs.open(path.join(path.join(dirname,UID),filename), 'r', function(status, fileDescripter) {
//                                                   if (status) {
//                                                     callback(status.message);
//                                                     return;
//                                                   }

//                                                   var buffer = new Buffer(fstatus.size);
//                                                   fs.read(fileDescripter, buffer, 0, fstatus.size, 0, function(err, num) {
//                                                       var headerInfo ={
//                                                                 'Authorization': 'Bearer ' + accessToken
//                                                               } ;
//                                                   var qsinfo = {
//                                                                  //request module adds "boundary" and "Content-Length" automatically.
//                                                                 'uploadType': 'multipart'
//                                                               };
//                                                   var multipartInfo =[
//                                                                 {
//                                                                   'Content-Type': 'application/json; charset=UTF-8',
//                                                                   'body': JSON.stringify({
//                                                                      'title': filename,
//                                                                      'parents': [
//                                                                        {
//                                                                          'id': SKU_FOLDER_ID
//                                                                        }
//                                                                      ]
//                                                                    })
//                                                                 },
//                                                                 {
//                                                                   'Content-Type': 'image/png',
//                                                                   'body': buffer
//                                                                 }
//                                                               ];
//                                                          request.post({
//                                                               'url': 'https://www.googleapis.com/upload/drive/v2/files',
//                                                               'qs': {
//                                                                  //request module adds "boundary" and "Content-Length" automatically.
//                                                                 'uploadType': 'multipart'
//                                                               },
//                                                               'headers' : {
//                                                                 'Authorization': 'Bearer ' + accessToken
//                                                               },
//                                                               'multipart':  [
//                                                                 {
//                                                                   'Content-Type': 'application/json; charset=UTF-8',
//                                                                   'body': JSON.stringify({
//                                                                      'title': filename,
//                                                                      'parents': [
//                                                                        {
//                                                                          'id': SKU_FOLDER_ID
//                                                                        }
//                                                                      ]
//                                                                    })
//                                                                 },
//                                                                 {
//                                                                   'Content-Type': 'image/png',
//                                                                   'body': buffer
//                                                                 }
//                                                               ]
//                                                         },function(err,res){
//                                                              if(!err){
//                                                                  fileCounter++;
//                                                                  if(fileCounter == fileCOunt)
//                                                                  {
//                                                                      fulfill('Files Uploaded');
//                                                                      deletFolderD(path.join(dirnameUpload,UID));
//                                                                      deletFolderD(path.join(_dirResize,UID));
//                                                                  }
//                                                              }
//                                                              else
//                                                              {
//                                                                     return false;
//                                                                     reject('Error Ocuccuyed');
//                                                              }

//                                                          });
//                                                     });
//                                                   });
//                                         }
//                                 });
//                             });


//                 }

//           },
//             //,
//           //----------------------------
//           // Parse the response
//           //----------------------------
//           function(response, body, callback) {
//               callback(null, body);
//           },

//         ],
//             function(err, results) {
//               if (!err) {
//                 res.status(200).send('processed successfully using async lib');
//               } else {

//               }
//             }
//         );
//    });
// }

function searchFile(VendorName, SkuName, repair, ipaddress, nowdate) {
    var Q = require('q');
    var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;
    var fileList = [];
    var vendorMatch = false;
    var skuMatch = false;
    var dirname = '../TempImages/Resized';
    var dirnameUpload = '../TempImages/Upload/';
    var async = require('async'),
        request = require('request'),
        fs = require('fs'),
        google = require('googleapis');
    var drive = google.drive('v3');
    var promise = require('promise');
    var deferred = Q.defer();
    var path = require('path');
    //return new Promise(function (response, reject){
    return new Promise(function (fulfill, reject) {
        async.waterfall([
                //-----------------------------
                // Obtain a new access token
                //-----------------------------

                function (callback) {
                    var tokenProvider = new GoogleTokenProvider({
                        'refresh_token': REFRESH_TOKEN,
                        'client_id': CLIENT_ID,
                        'client_secret': CLIENT_SECRET
                    });
                    tokenProvider.getToken(callback);
                },
                function (accessToken, fileData, callback) {
                    var SKU_FOLDER_ID = '';
                    var VENDOR_FOLDER_ID = '';
                    var vendorfileMetadata = {
                        'name': VendorName,
                        'mimeType': 'application/vnd.google-apps.folder',
                        'parents': [MAIN_FOLDER_ID]
                    };
                    var mainFolderMetaData = {
                        'mimeType': 'application/vnd.google-apps.folder and trashed',
                        'parents': [MAIN_FOLDER_ID]
                    };
                    drive.files.list({
                        'q': '"' + MAIN_FOLDER_ID + '" in parents and trashed = false',
                        'headers': {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }, function (err, response) {
                        if (err) {
                            if (enableLogging) {
                                logger.logData(ipaddress, " ", SkuName, "CANCELREPAIR-Error while finding Vendor Folder :( ", VendorName, nowdate, err).then((sucess) => {

                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                            reject("Error");
                        } else {
                            var arrayFound = response.files.filter(function (item) {
                                if (item.name == VendorName) {
                                    VENDOR_FOLDER_ID = item.id;
                                    vendorMatch = true;
                                    return false;
                                }
                            });
                            if (vendorMatch) {
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "CANCELREPAIR-Vendor Folder Found :) ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                                skuExistsCheck();
                            } else {
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "Vendor Folder not found :( ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                                newVendor();

                            }
                        }
                    });
                    //newVendor();
                    function skuExistsCheck() {
                        drive.files.list({
                            'q': '"' + VENDOR_FOLDER_ID + '" in parents and trashed = false',
                            'headers': {
                                'Authorization': 'Bearer ' + accessToken
                            }
                        }, function (err, response) {
                            if (err) {
                                if (enableLogging) {
                                    logger.logData(ipaddress, " ", SkuName, "CANCELREPAIR-Error while finding SKU Folder :( ", VendorName, nowdate, err).then((sucess) => {

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }
                                reject("Error");
                            } else {
                                var skuFound = response.files.filter(function (item) {
                                    if (item.name == SkuName) {
                                        SKU_FOLDER_ID = item.id;


                                        skuMatch = true;
                                        return false;
                                    }
                                });
                                if (skuMatch) {
                                    if (enableLogging) {
                                        logger.logData(ipaddress, " ", SkuName, "CANCELREPAIR-SKU Folder found :) ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    }
                                    fetchRepairNumberFile(null, fetchRepairNumberFile, function (err) {
                                        if (err) {} else {}
                                    });
                                } else {
                                    if (enableLogging) {
                                        logger.logData(ipaddress, " ", SkuName, "CANCELREPAIR-SKU Folder not found :( ", VendorName, nowdate, "SUCCESS").then((sucess) => {

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    }
                                    fulfill("Not found");
                                }
                            }
                        });

                    }

                    var fetchRepairNumberFile = function (pageToken, pageFn, callback) {
                        drive.files.list({
                            'q': '"' + SKU_FOLDER_ID + '" in parents and trashed = false',
                            'headers': {
                                'Authorization': 'Bearer ' + accessToken
                            }
                        }, function (err, res) {
                            //console.log(res);
                            if (res != null) {
                                logger.logData(ipaddress, " ", SkuName, "CANCELREPAIR-Looping through repair files from google Drive : ", VendorName, nowdate, "Success").then((sucess) => {

                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                                res.files.forEach(function (file) {
                                    if (file.name.indexOf(repair) > -1) {
                                        try {
                                            drive.files.delete({
                                                'fileId': file.id,
                                                'headers': {
                                                    'Authorization': 'Bearer ' + accessToken
                                                }
                                            });
                                            logger.logData(ipaddress, " ", SkuName, "CANCELREPAIR-Succesfully deleted the repair files from google Drive :) ", VendorName, nowdate, "Success").then((sucess) => {})
                                                .catch((error) => {
                                                    console.log(error);
                                                });
                                            //Log Success
                                            //fulfill('Files Deleted');
                                        } catch (err) {
                                            console.log(err);
                                            logger.logData(ipaddress, " ", SkuName, "CANCELREPAIR-Error while deleting the repair files from google Drive :( ", VendorName, nowdate, err).then((sucess) => {

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                        }
                                    }
                                });
                            }
                            fulfill(200);
                           

                        });
                    };
                },
                //,
                //----------------------------
                // Parse the response
                //----------------------------
                function (response, body, callback) {
                    callback(null, body);
                },

            ],
            function (err, results) {
                if (!err) {
                    res.status(200).send('processed successfully using async lib');
                } else {

                }
            }
        );
    });
}

function renameFiles(dir, name) {
    var path = require('path');
    fs.readdir(dir, function (err, filenames) {

        filenames.forEach(function (filename) {

            fs.renameSync(path.join(dir, filename), path.join(dir, filename.replace("Repair#", name)), function (err) {});
        });
    });
}

exports.imageResize = function (imageName, ipaddress, skuName, repairnumber, vendorName, nowdate) {
    imageResize(imageName, ipaddress, skuName, repairnumber, vendorName, nowdate);
};
exports._googleDriveHandler = function (VendorName, vendorFullName, SkuName, UID, ipaddress) {

    return _googleDriveHandler(VendorName, vendorFullName, SkuName, UID, ipaddress);
};
exports.deletFolderD = function (path) {
    return deletFolderD(path);
};
exports.renameFiles = function (dir, name) {
    return renameFiles(dir, name);
};
exports.sendEmail = function (vendorName, vendorFullName, EmailID, EmailPassword, EmailSubject, EmailBody) {
    sendEmail(vendorName, vendorFullName, EmailID, EmailPassword, EmailSubject, EmailBody);
};

exports.generateUUID = function () {
    return generateUUID();
};


exports.generateRandom = function () {
    return generateRandom();
};
exports.searchFile = function (vendorID, sku, repair, ipaddress, nowdate) {

    return searchFile(vendorID, sku, repair, ipaddress, nowdate);
};