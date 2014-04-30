var http = require('http');
var url = require('url');
var freedom = require('freedom-for-node').freedom;
require('./pool');
var manager = freedom('manager.json', {
  debug: false
});
/*
http.createServer(function(req, resp) {
  resp.writeHead(200, {'Content-Type': 'text/html'});
  var queryData = url.parse(req.url, true).query;
  if (queryData.pool) {
    manager.emit('pool', queryData.pool);
    resp.end("filled to " + queryData.pool);
  } else if (queryData.push) {
    manager.emit('push', queryData.push);
  } else {
    resp.end("<html>load" +
    "<form method=get>Push:<input type=text name=push value=10></form>" + 
    "<form method=get>Pool:<input type=text name=pool value=10></form></html>");
  }
}).listen(9876);
*/

exports.manager = manager;

exports.churn = function(often,mult,until) {
  var interval = setInterval(function() {
    manager.emit('req', mult);
  }, often);
  setTimeout(function() {
    console.warn('its done');
    clearInterval(interval);
  }, until);
};

exports.sampleChurn = function(pool,rate,mult) {
  m.manager.emit('pool', pool);
  //var mult = Math.ceil(100/rate);
  //if (mult > 1) {
  //  rate /= mult;
  //}
  setTimeout(function() {
    exports.churn(rate, mult, 10000);
  }, 2000);
};
