"use strict";

const MCMC = {
  algorithmNames: [],
  algorithms: {},
  targetNames: [],
  targets: {},
  registerAlgorithm: (name, methods) => {
    MCMC.algorithmNames.push(name);
    MCMC.algorithms[name] = methods;
  },
  computeMean: (chain) => {
    const mean = chain[0].copy();
    for (let i = 1; i < chain.length; ++i) mean.increment(chain[i]);
    return mean.scale(1.0 / chain.length);
  },
  computeAutocorrelation: (chain, lag) => {
    const mean = MCMC.computeMean(chain);
    const autocovariance = zeros(lag, 1);
    for (let k = 0; k <= lag; ++k)
      for (let i = k; i < chain.length; ++i)
        autocovariance[k] += chain[i].subtract(mean).dot(chain[i - k].subtract(mean));
    return autocovariance.scale(1.0 / autocovariance[0]);
  },
};

function gradient(f, x, e=0.00001) {
  const grad = zeros(x.length, 1);
  for (let i = 0; i < x.length; i++) {
    const dx = zeros(x.length, 1);
    dx[i] = e;
    grad[i] = (f(x.add(dx)) - f(x)) / e;
  }
  return grad;
}

function sin_f(x) {
  return Math.sin(1.5 * Math.sqrt(Math.pow(x[0], 2) + Math.pow(x[1], 2)));
}

MCMC.targetNames.push("Sin");
MCMC.targets["Sin"] = {
  xmin: -10,
  xmax: 10,
  function: sin_f,
  gradLogDensity: (x) => {
    const kappa = 1000;
    const grad = gradient(sin_f, x).scale(-kappa);
    return grad;
  },
};

function rosenbrock(x) {
  return 100 * Math.pow(x[1] - x[0] * x[0], 2) + Math.pow(1 - x[0], 2);
}

MCMC.targetNames.push("Rosenbrock");
MCMC.targets["Rosenbrock"] = {
  xmin: -10,
  xmax: 10,
  function: rosenbrock,
  gradLogDensity: (x) => {
    const kappa = 100;
    const grad = gradient(rosenbrock, x).scale(-kappa);
    return grad;
  },
};

function ackley(x) {
  const a = 20;
  const b = 0.2;
  const c = 2 * Math.PI;
  const d = x.length;
  return -a * Math.exp(-b * Math.sqrt(x.dot(x) / d)) - Math.exp(x.scale(c).map(Math.cos).sum() / d) + a + Math.exp(1);
}

MCMC.targetNames.push("Ackley");
MCMC.targets["Ackley"] = {
  xmin: -10,
  xmax: 10,
  function: ackley,
  gradLogDensity: (x) => {
    const kappa = 100;
    const grad = gradient(ackley, x).scale(-kappa);
    return grad;
  },
};

function holder_table(x) {
  const a = Math.abs(1 - Math.sqrt(x.dot(x)) / Math.PI);
  return -Math.abs(Math.sin(x[0]) * Math.cos(x[1]) * Math.exp(a));
}

MCMC.targetNames.push("Holder Table");
MCMC.targets["Holder Table"] = {
  xmin: -10,
  xmax: 10,
  function: holder_table,
  gradLogDensity: (x) => {
    const kappa = 100;
    const grad = gradient(holder_table, x).scale(-kappa);
    return grad;
  },
};