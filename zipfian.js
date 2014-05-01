var ZipfianGenerator = function(items, constant) {
  this.constant = constant || 0.99;
  this.items = items;

  this.theta = this.constant;
  this.zeta2theta = this.getZeta(0, 2, this.theta, 0);
  this.alpha = 1.0/(1.0 - this.theta);
  this.zetan = this.getZeta(0, this.items, this.constant, 0);
  this.countforzeta = this.items;
  this.eta = (1 - Math.pow(2.0/this.items, 1 - this.theta))/(1 - this.zeta2theta / this.zetan);
};

ZipfianGenerator.prototype.getZeta = function(st,n,theta,isum) {
  var sum = isum;
  for (var i = st; i<n;i++) {
    sum += 1.0/Math.pow(i+1,theta);
  }
  return sum;
};

ZipfianGenerator.prototype.next = function(items) {
  if (items != this.countforzeta) {
    if (items > this.countforzeta) {
      this.zetan = this.getZeta(this.countforzeta, items, this.theta, this.zetan);
      this.eta = (1 - Math.pow(2.0/this.items, 1 - this.theta))/(1 - this.zeta2theta / this.zetan);
    } else {
      console.warn('item decrease not supported.');
    }
  }
  var u = Math.random();
  var uz = u * this.zetan;
  
  if (uz < 1.0) {
    return 0;
  }
  if (uz < 1.0 + Math.pow(0.5, this.theta)) {
    return 1;
  }
  var ret = (this.items * Math.pow(this.eta * u - this.eta + 1, this.alpha));
  return ret;
};

exports.ZipfianGenerator = ZipfianGenerator;

