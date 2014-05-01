var signer = require('./signs');
var zipff = require('./zipfian').ZipfianGenerator;
var zipf = new zipff(1000);
var MongoClient = require('mongodb').MongoClient;

var n = 100000;

var qs = [];
var ms = [];
for (var i = 0; i < n; i++) {
  var key = Math.floor(zipf.next(1000));
  qs.push(key);
}
for (var i = 0; i < 1000; i++) {
  var m = 'this is message ' + key + ': ' + i;
  while(m.length < 1024) {
    m += 'x';
  }
  ms.push([ms, signer.sm(m)]);
};
console.log('msgs ready to go');

MongoClient.connect('mongodb://mariner.cs.washington.edu:27017/test', function(err, db) {
  if (err) throw err;
  var collection = db.collection('test_insert');
  var todo = ms.length;
  for(var i = 0; i < ms.length; i++) {
    collection.insert({'key': ms[i][0], 'val': ms[i][1]}, function() {
      todo -= 1;
if (todo == 0) {
  console.log('inserts made');
}
    });
  }
});

exports.doTest = function(verify) {
  MongoClient.connect('mongodb://mariner.cs.washington.edu:27017/test', function(err, db) {
    var collection = db.collection('test_insert');
    var start = process.hrtime(), end;

    var os = qs.length;
    if (verify) {
    for (var i = 0; i < qs.length; i++) {
      collection.find({'key': qs[i]}).nextObject(function(err,doc) {
        signer.vm(doc['val']);
        os--;
        if (os == 0) {
          end = process.hrtime();
          stats(start,end);
        }
      });
    }
  } else {
    for (var i = 0; i < qs.length; i++) {
      collection.find({'key': qs[i]}).nextObject(function(err,doc) {
        os--;
        if (os == 0) {
          end = process.hrtime();
          stats(start,end);
        }
      });
    }
  }
  });
}

var stats = function(start,end) {
  var total = end[1] - start[1] + (end[0] - start[0] * 1000000000);

  console.log('q time: ' + (total/n/1000000) + 'ms');    
}

