var crypto = require('crypto');
var rsa = require('ursa');
var pubk,prik;

var k = rsa.generatePrivateKey();
prik = k.toPrivatePem().toString('utf8');
pubk = k.toPublicPem().toString('utf8');

exports.sm = function(msg) {
  var sign = crypto.createSign('sha1');
  sign.update(msg);
  var sig = sign.sign(prik);  
  return [msg, sig];
};

exports.vm = function(msg) {
  var verify = crypto.createVerify('sha1');
  verify.update(msg[0]);
  if (verify.verify(pubk, msg[1])) {
    return msg[0];
  } else {
    return null;
  }
};
