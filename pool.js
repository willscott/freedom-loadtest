var freedom = require('freedom-for-node').freedom;

var poolLevel = 1;
var pool = [];
var users = {};

exports.fillPool = function(level) {
  if (level) {
    poolLevel = level;
  }
  while(pool.length < poolLevel) {
    pool.push(freedom('user/user.json'));
  }
};

exports.get = function(id) {
  if (users[id]) {
    return users[id];
  } else if (pool.length) {
    users[id] = pool.pop();
    users[id].emit('id', id);
    return users[id];
  } else {
    users[id] = freedom('user/user.json');
    users[id].emit('id', id);
    return users[id];
  }
};