var core = freedom.core();
var poolLevel = 1;
var poolOutstanding = 0;
var pool = [];
var users = {};

var poolManager = freedom['core.echo']();

var refillPool = function() {
  var deficit = poolLevel - (pool.length + poolOutstanding);
//  if (deficit < 10) {
//    return;
//  }
  for (var i = 0; i < deficit; i++) {
    poolOutstanding += 1;
    core.createChannel().then(function(chan) {
      poolOutstanding -= 1;
      pool.push(chan.channel);
      chan.channel.on('q', onq);
      chan.channel.on('gotresp', function(d) {
        var resp = reqs[d.id];
        delete reqs[d.id];
        resp.end(d.val);
      });
      poolManager.setup(chan.identifier);
    });
  }
};

var http = require('http');
var url = require('url');

var reqs = {};

freedom.on('web', function() {
http.createServer(function(req, resp) {
  resp.writeHead(200, {'Content-Type': 'text/html'});
  var queryData = url.parse(req.url, true).query;
  if (queryData.pool) {
    poolLevel = parseInt(queryData.pool);
    refillPool();
    resp.end("pool now @ " + poolLevel);
    return;
  } else {
    var id = Math.random();
    reqs[id] = resp;

    var user = pool[Math.floor(Math.random()*pool.length)];
    user.emit('getresp', id);
  }
}).listen(9876);
});

freedom.on('pool', function(level) {
  if (level) {
    poolLevel = level;
    console.log('pool is ' + level);
  }
  refillPool();
});

freedom.on('push', function(n) {
  // Choose a user to make the push.
  var who = [];
  for (var i = 0; i < n; i++) {
    who.push(Math.random());
  }

  var id = Math.random();
  var user = getU(id);
  if (user) {
    user.emit('push', who);
  }
});

freedom.on('req',function(n) {
  for (var i = 0; i < n; i++) {
    ruser();
  }
});


var timeouts = [];

var mon = function() {
  console.log('monitoring');
  timeouts.push(setInterval(function() {
   if(i - (ip + 10*is) < -1 * is) {
     console.log('Failing to keep up.');
     console.log('this step was ' + (i - ip) + ' vs expected ' + 10*is);
     for (var j = 0; j < timeouts.length; j++) {
       clearInterval(timeouts[j]);
     }
     timeouts = [];
     freedom.emit('over', is);
     i = ip = is = is_new = 0;
   } else {
     ip = i;
     is += is_new;
     is_new = 0;
   }
  },10000));
};
freedom.on('monitor', mon);

var nqps = function(n) {
  if (n > 10) {
    var x = n - 10;
    n = 10;
    setTimeout(nqps.bind({}, x), 10);
  }
  for (var j = 0; j < n; j++) {
    timeouts.push(setInterval(q,1000));
    i += 1;
    is_new += 1;
  }
  console.log('qps is now ' + (is+is_new));
};
freedom.on('qps', nqps);

var i = 0;
var ip = 0;
var is = 0;
var is_new = 0;

var q = function() {
  var user = pool[Math.floor(Math.random()*pool.length)];
  user.emit('q',process.hrtime());
};

var onq = function(n) {
  i += n;
};

var ruser =  function() {
  var user = pool.pop();
  if (!user) {
    console.warn('request dropped');
  } else {
    user.emit('create', process.hrtime());
    refillPool();
  }
};

var getU = function(id) {
  if (users[id]) {
    return users[id];
  } else if (pool.length) {
    users[id] = pool.pop();
    console.log('CREATE: ' + process.hrtime());
    users[id].emit('create', id);

    var deficit = poolLevel - (pool.length + poolOutstanding);
    if (deficit > poolLevel / 2) {
      refillPool();
    }

    return users[id];
  } else {
    console.warn('pool empty.');
    return null;
  }
};
