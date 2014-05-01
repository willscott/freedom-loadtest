var signer = require('./signs');

var n = 10000;

var msgs = [];
for (var i = 0; i < n; i++) {
  var m = 'this is message ' + i;
  msgs.push(signer.sm(m));
};

var responses = [];

var start = process.hrtime();

for (var i = 0; i < msgs.length; i++) {
  responses.push(signer.vm(msgs[i]));
}

var end = process.hrtime();

var total = end[1] - start[1] + (end[0] - start[0]) * 1000000000;

console.log('verification imposed ' + (total/n/1000000) + 'ms');
