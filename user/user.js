var social = freedom.social();
var storage = freedom.storage();
var core = freedom.core();
var myId;

var myLog = "";

var manager = null;

freedom.on('channel', function(id) {
  core.bindChannel(id).then(function(chan) {
    manager = chan;
    manager.on('create', create);
    manager.on('push', push);
  });
});

var create = function(id) {
  var ms = process.hrtime()[1] - id;
  console.log('creation time :' + ms);
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
