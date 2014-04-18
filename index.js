var freedom = require('freedom-for-node').freedom;
var http = require('http');
var url = require('url');

var pool = [];
var users = {};

var fillPool = function(level) {
  while(pool.length < level) {
    pool.push(freedom('user/user.json'));
  }
};

http.createServer(function(req, resp) {
  resp.writeHead(200, {'Content-Type': 'text/html'});
  var queryData = url.parse(req.url, true).query;
  if (queryData.pool) {
    fillPool(queryData.pool);
    resp.end("filled to " + queryData.pool)
  } else {
    resp.end("<html>load<form method=get><input type=text name=pool value=10/></form></html>");
  }
}).listen(9876);