var online = {};
var boxes = {};

var Social = function(dispatch) {
  this.dispatchEvent = dispatch;
};

Social.prototype.login = function(opts, callback) {
  this.id = opts.agent;
  online[this.id] = this;

  callback({
    userId: this.id,
    clientId: this.id,
    timestamp: (new Date()).getTime(),
    status: "ONLINE"
  });

  if (boxes[this.id]) {
    var msgs = boxes[this.id];
    delete boxes[this.id];
    for (var i = 0; i < msgs.length; i++) {
      this.dispatchEvent('onMessage', {
        from: msgs[i].from,
        message: msgs[i].msg
      });
    }
  }
};

Social.prototype.sendMessage = function(to, msg, callback) {
  var from = {
    userId: this.id,
    clientId: this.id,
    timestamp: (new Date()).getTime(),
    status: "ONLINE"
  };

  if (online[to]) {
    online[to].dispatchEvent('onMessage', {
      from: from,
      message: msg
    })
  } else {
    if (!boxes[to]) {
      boxes[to] = []
    }
    boxes[to].push({
      from: from,
      msg: msg
    });
  }
};

/** REGISTER PROVIDER **/
if (typeof freedom !== 'undefined') {
  freedom.social().provideAsynchronous(Social);
}