var Datastore = require('nedb')
  , db = new Datastore({ filename: 'store.nedb', autoload: true });

var Storage = function(dispatch) {
  this.dispatchEvent = dispatch;
};

Storage.prototype.get = function(key, callback) {
  db.findOne({ key: key }, function (err, doc) {
    callback(doc, err);
  });
};

Storage.prototype.set = function(key, val, callback) {
  db.insert({ key: key, val: val }, function (err, doc) {
    callback(doc, err);
  });
};

/** REGISTER PROVIDER **/
if (typeof freedom !== 'undefined') {
  freedom.storage().provideAsynchronous(Storage);
}