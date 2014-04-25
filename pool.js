//Todo: this is abusing the fact that the fdom namespace isn't well cleaned up in the node version.

var Pool = function(caller, dispatch) {
  this.caller = caller;
  this.policy = this.caller.config.policy;
  this.core = this.caller.core;
};

Pool.prototype.setup = function(id, continuation) {
  var base = this.caller.manifestId;
  fdom.resources.get(base, 'user/user.json').then(function(url) {
    this.policy.get(this.caller.lineage, url).then(function(user) {
      this.core.manager.setup(user);
      this.core.bindChannel(id, continuation, user);
    }.bind(this));
  }.bind(this));
};

fdom.apis.register('core.echo', Pool);
