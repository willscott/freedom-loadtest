var social = freedom.social();
var storage = freedom.storage();
var myId;

var myLog = "";

freedom.on('create', function(id) {
  if (!myId) {
    myId = id;
    social.login({
      agent: myId
    });
    storage.get(myId).then(function(log) {
      myLog = log;
    });
  } else {
    console.error('Already a user!');
  }
});

freedom.on('push', function(ids) {
  var who = ids.split(",");
  for (var i = 0; i < who.length; i++) {
    social.sendMessage(who[i], "Push [" + i + "/" + who.length + "] to " + who[i] );
  }
});

social.on('onMessage', function(msg) {
  var str = JSON.stringify(msg);
  myLog += str.length + "." + str;
  storage.set(myId, myLog)
});
