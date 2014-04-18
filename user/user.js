freedom.on('push', function(n) {
  freedom.emit('result', 'pushed to ' + n.n + ' in ' + 0);
});
