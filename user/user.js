var social = freedom.social();
var storage = freedom.storage();
var core = freedom.core();
var myId;

var myLog = "";

var manager = null;

var c = 0;

freedom.on('channel', function(id) {
  core.bindChannel(id).then(function(chan) {
    manager = chan;
    manager.on('create', create);
    manager.on('push', push);
    manager.on('q', function(n) {
      //todo: process req.
      manager.emit('q', n);
    });
    manager.on('getresp', function(id) {
      manager.emit('gotresp', {id: id, val: 'response #' + c++ });
    });
  });
});

var create = function(id) {
  var now = process.hrtime();
  var ms = now[1] - id[1];
  if (now[0] != id[0]) {
    ms += (now[0] - id[0])*1000000000
  }
  //console.log(now + '-\t' + ms);
  console.log(ms);
  process.exit(0);
  if (!myId) {
    myId = id;
//    console.log('User created as ' + id);
//    social.login({
//      agent: myId
//    });
//    storage.get(myId).then(function(log) {
//      myLog = log;
//    });
  } else {
    console.error('Already a user!');
  }
};

var push = function(ids) {
  for (var i = 0; i < ids.length; i++) {
//    social.sendMessage(ids[i], "Push [" + i + "/" + ids.length + "] to " + ids[i] );
  }
};

social.on('onMessage', function(msg) {
  var str = JSON.stringify(msg);
  myLog += str.length + "." + str;
  storage.set(myId, myLog)
});
