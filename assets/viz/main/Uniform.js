"use strict";

class Uniform {
  constructor(min, max) {
    this.min = min;
    this.max = max;
    this.dim = min.rows;
  }
  getSample() {
    const z = zeros(this.dim, 1);
    for (let i = 0; i < this.dim; i++) {
      z[i] = Math.random() * (this.max[i] - this.min[i]) + this.min[i];
    }
    return z;
  }
  logDensity(x) {
    const d = 1 / (this.max - this.min);
    return Math.log(d);
  }
  gradLogDensity(x) {
    return 0;
  }
  toString() {
    return (
      "uniform(" +
      this.min.transpose().toString() +
      ", " +
      this.max.transpose().toString() +
      ")"
    );
  }
  static getSample(dim) {
    const dist = new Uniform(zeros(dim), ones(dim));
    return dist.getSample();
  }
}
