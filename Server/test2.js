var fs = require('fs');
var Jimp = require("jimp");
//fs.renameSync("..\\TempImages\\test\\1.jpg", "..\\TempImages\\test\\1\\1.jpg", function(err) {
var lenna = new Jimp("..\\TempImages\\test\\1.jpg", function () {
    this.resize(1000, 800) // resize
        .quality(80)                 // set JPEG quality
        .write("..\\TempImages\\test\\1\\1.jpg"); // save
});