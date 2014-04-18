var http = require('http');
var url = require('url');
var pool = require('./pool');

var push = function(toHowMany, resp) {
  var user = pool.get(Math.random());
  user.on('result', function(result) {
    resp.end(result);
  });
  user.emit('push', {'n': toHowMany});
};

http.createServer(function(req, resp) {
  resp.writeHead(200, {'Content-Type': 'text/html'});
  var queryData = url.parse(req.url, true).query;
  if (queryData.pool) {
    pool.fillPool(queryData.pool);
    resp.end("filled to " + queryData.pool);
  } else if (queryData.push) {
    push(queryData.push, resp);
  } else {
    resp.end("<html>load" +
    "<form method=get>Push:<input type=text name=push value=10></form>" + 
    "<form method=get>Pool:<input type=text name=pool value=10></form></html>");
  }
}).listen(9876);