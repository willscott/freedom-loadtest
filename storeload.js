var signer = require('./signs');
var zipff = require('./zipfian').ZipfianGenerator;
var zipf = new zipff(1000);
var MongoClient = require('mongodb').MongoClient;
var q=  require('q');

var n = 10000;

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
  ms.push([i, signer.sm(m)]);
};
console.log('msgs ready to go');

var pnext = function(coll) {
  var nex = ms.pop();
  coll.insert({'key': nex[0], 'val': nex[1]}, function(e) {
    if (e) throw e;
    if (ms.length) {
      process.nextTick(function() {
        pnext(coll)
      });
    } else {
      console.log('inserts made');
    }
  });
}

MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  if (err) throw err;
  var collection = db.collection('test_insert');
  pnext(collection);
});

var fnextV = function(qq,coll) {
  var mq = qq.pop();
  var ts = process.hrtime();
  coll.find({'key': mq}).nextObject(function(s,err,doc) {
    if (err) throw err;
    signer.vm(doc['val']);
    var e = process.hrtime();
    latencies.push((e[1] - s[1])/1000000000 + (e[0] - s[0]));
    if (qq.length) {
      process.nextTick(function() {
        fnextV(qq, coll)
      });
    } else {
      stats(teststart, process.hrtime());
    }
  }.bind({},ts));
};

var fnextV = function(qq,coll) {
  var mq = qq.pop();
  var ts = process.hrtime();
  coll.find({'key': mq}).nextObject(function(s,err,doc) {
    if (err) throw err;
    var e = process.hrtime();
    latencies.push((e[1] - s[1])/1000000000 + (e[0] - s[0]));
    if (qq.length) {
      process.nextTick(function() {
        fnextV(qq, coll)
      });
    } else {
      stats(teststart, process.hrtime());
    }
  }.bind({},ts));
};


var teststart;
var testend;
var latencies = [];

exports.doTest = function(verify) {
  var thisqs = [];
  qs.forEach(function(q) {
    thisqs.push(q);
  });

  MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    var collection = db.collection('test_insert');
    teststart = process.hrtime();

    if (verify) {
      for (var i = 0; i < 10; i++) {
        fnextV(thisqs, collection);
      }
    } else {
      for (var i = 0; i < 10; i++) {
        fnext(thisqs, collection);
      }
    }
  });
  return q.Promise(function(resolve,reject) {
    testend = resolve;
  });
}

var stats = function(start,end) {
  teststart = 0;
  if (start == 0) return;
  var totalL = 0;
  latencies.forEach(function(l) {
    totalL += l;
  });
  totalL /= latencies.length;
  latencies = [];
  var total = (end[1] - start[1])/1000000000 + (end[0] - start[0]);

  console.log(n/total + '\t' + toalL);

  testend();
}

