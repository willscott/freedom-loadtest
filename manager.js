var core = freedom.core();
var poolLevel = 1;
var poolOutstanding = 0;
var pool = [];
var users = {};

var poolManager = freedom['core.echo']();

var refillPool = function() {
  var deficit = poolLevel - (pool.length + poolOutstanding);
  for (var i = 0; i < deficit; i++) {
    poolOutstanding += 1;
    core.createChannel().then(function(chan) {
      poolOutstanding -= 1;
      pool.push(chan.channel);
      poolManager.setup(chan.identifier);
    });
  }
};

freedom.on('pool', function(level) {
  if (level) {
    poolLevel = level;
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

var getU = function(id) {
  if (users[id]) {
    return users[id];
  } else if (pool.length) {
    users[id] = pool.pop();
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