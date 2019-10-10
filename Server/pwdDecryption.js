// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
var fs = require('fs');
var passwordtobeEncrypted = 'ph(MH[=/w-Xpt2Yt';
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

var hw = encrypt(passwordtobeEncrypted);
// outputs hello world

fs.writeFile('EncryptedData.txt' ,hw, function(error) {
     if (error) {
       console.error("write error:  " + error.message);
     } else {

     }
});
fs.writeFile('DecryptedData.txt' , decrypt("168bda852a7029227118b65e"), function(error) {
     if (error) {
       console.error("write error:  " + error.message);
     } else {

     }
});
