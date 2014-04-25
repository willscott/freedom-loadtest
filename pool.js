//Todo: this is abusing the fact that the fdom namespace isn't well cleaned up in the node version.

var Pool = function(caller, dispatch) {
  console.warn('pool instantiated');
};

Pool.prototype.setup = function(id, continuation) {
  console.warn('pool asked to make user container & bind with ' + id);
  continuation('hi');
};

fdom.apis.register('core.echo', Pool);
