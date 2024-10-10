"use strict";

MCMC.registerAlgorithm("SBS-PF", {
  description: "Stein Boltzmann Sampling - Particle Filtering",

  about: function () {
    window.open("https://arxiv.org/abs/2402.04689");
  },

  init: function (self) {
    self.chain = [];
    self.n = 1000; // number of particles
    self.epsilon = 0.01; // step size
    self.h = 0.02; // bandwidth
    self.use_median = false;
    self.use_adagrad = false;
    self.use_auto_sigma = true;
    self.alpha = 0.9;
    self.fudge_factor = 1e-2;
    self.iter = 0;
    self.distance_q=0.5;
    self.value_q=0.3;
    self.removed_chain=[];
    self.show_removed=true;
    self.reset(self);
    
  },

  reset: function (self) {
    // initialize chain with samples from standard normal
    self.chain = [];
    self.removed_chain = [];
    self.gradx = [];
    self.historical_grad = [];
    self.gradLogDensities = [];
    self.functionValues = [];
    self.n = 1000;
    self.iter = 0;
    self.dist = new Uniform(
      ones(self.dim).scale(self.xmin),
      ones(self.dim).scale(self.xmax)
    );
    for (let i = 0; i < self.n; i++) {
      self.chain.push(self.dist.getSample());
      self.gradx.push(Float64Array.zeros(self.dim, 1));
      self.historical_grad.push(Float64Array.zeros(self.dim, 1));
      self.gradLogDensities.push(0);
      self.functionValues.push(0);
    }
  },

  attachUI: function (self, folder) {
    // folder.add(self, "use_median").name("Median heuristic").listen();
    folder.add(self, "distance_q", 0, 1).step(0.05).name("Distance quantile");
    folder.add(self, "value_q", 0, 1).step(0.05).name("Value quantile");
    folder.add(self, "use_auto_sigma").name("Auto bandwidth");
    folder
      .add(self, "h", 0.001, 10)
      .step(0.001)
      .name("bandwidth")
      .listen()
      .onChange(function (value) {
        self.use_median = false;
      });
    // folder.add(self, "use_adagrad").name("Adagrad");
    folder.add(self, "epsilon", 0.001, 0.1).step(0.001).name("stepsize");
    // folder.add(self, 'alpha', 0.01, 1.0).step(0.01).name('alpha');
    // folder.add(self, 'fudge_factor', 0.0001, 0.05).step(0.0001).name('fudge_factor');
    folder.add(self, "n", 10, 4000).step(1).name("numParticles");
    folder.add(self, "show_removed").name("Show removed particles");
    folder.open();
  },

  step: function (self, visualizer) {
    function remove_particles(chain_old) {
      if (self.chain.length > 10) {
        var distance = [];
        for (let i = 0; i < self.chain.length; i++) {
          distance.push(self.chain[i].subtract(chain_old[i]).norm());
        }
        var dist_quantile = quantile(distance, self.distance_q);
        var dist_mask = [];
        for (let i = 0; i < distance.length; i++) {
          dist_mask.push(distance[i] < dist_quantile);
        }
  
        var value_quantile = quantile(self.functionValues, self.value_q);
        var value_mask = [];
        for (let i = 0; i < self.chain.length; i++) {
          value_mask.push(self.functionValues[i] > value_quantile);
        }
  
        var mask = [];
        for (let i = 0; i < self.chain.length; i++) {
          mask.push(!(dist_mask[i] && value_mask[i]));
        }
  
        if (mask.every((v) => v)) {
          return {new_chain: self.chain, mask: ones(self.chain.length)};
        } else {
          var new_chain = [];
          for (let i = 0; i < self.chain.length; i++) {
            if (mask[i]) {
              new_chain.push(self.chain[i].scale(1));
            }
          }
          return {new_chain: new_chain, mask: mask};
        }
      }
      return {new_chain: self.chain, mask: ones(self.chain.length)};
    }


    // resize samples appropriately
    if (self.n > self.chain.length) {
      for (let i = 0; i < self.n - self.chain.length; i++) {
        self.chain.push(self.dist.getSample());
        self.gradx.push(zeros(self.dim, 1));
        self.historical_grad.push(zeros(self.dim, 1));
        self.gradLogDensities.push(0);
        self.functionValues.push(0);
      }
    } else if (self.n < self.chain.length) {
      self.chain = self.chain.slice(0, self.n);
      self.gradx = self.gradx.slice(0, self.n);
      self.historical_grad = self.historical_grad.slice(0, self.n);
      self.gradLogDensities = self.gradLogDensities.slice(0, self.n);
      self.functionValues = self.functionValues.slice(0, self.n);
    }

    var n = self.chain.length;

    // precompute log densities
    for (let i = 0; i < n; i++) {
      self.gradLogDensities[i] = self.gradLogDensity(self.chain[i]);
      self.functionValues[i] = self.function(self.chain[i]);
      for (let k = 0; k < self.dim; k++) {
        self.gradx[i][k] = 0;
      }
    }

    // pairwise distances trick
    var dist2 = new Float64Array(n * n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        var delta = 0;
        for (let k = 0; k < self.dim; k++) delta += Math.pow(self.chain[i][k] - self.chain[j][k], 2);
        dist2[i * n + j] = delta;
        dist2[j * n + i] = delta;
      }
    }

    if (self.use_median) {
      var dist2copy = new Float64Array(dist2);
      dist2copy.sort();
      var median = dist2copy[Math.floor(dist2copy.length / 2)];
      self.h = median / Math.log(n);
    }

    if (self.use_auto_sigma) {
      self.h = 1 / self.n;
    }

    // compute gradient
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        var rbf = Math.exp(-dist2[i * n + j] / self.h);
        for (let k = 0; k < self.dim; k++) {
          var grad_rbf = ((self.chain[i][k] - self.chain[j][k]) * 2 * rbf) / self.h;
          self.gradx[i][k] += self.gradLogDensities[j][k] * rbf + grad_rbf;
        }
      }
      for (let k = 0; k < self.dim; k++) {
        self.gradx[i][k] /= n;
      }
    }

    // adagrad
    if (self.use_adagrad) {
      for (let i = 0; i < n; i++)
        for (let k = 0; k < self.dim; k++)
          self.historical_grad[i][k] =
            self.alpha * self.historical_grad[i][k] + (1 - self.alpha) * Math.pow(self.gradx[i][k], 2);
      for (let i = 0; i < n; i++)
        for (let k = 0; k < self.dim; k++)
          self.gradx[i][k] /= self.fudge_factor + Math.sqrt(self.historical_grad[i][k]);
    }

    for (let i = 0; i < n; i++) {
      for (let k = 0; k < self.dim; k++) {
        self.gradx[i][k] *= self.epsilon;
      }
    }

    const chain_old = JSON.parse(JSON.stringify(self.chain));

    // update particles
    for (let i = 0; i < n; i++) {
      self.chain[i].increment(self.gradx[i]);
    }

    const {new_chain, mask} = remove_particles(chain_old);
    
    for (let i = 0; i < self.chain.length; i++) {
      if (!mask[i]) {
        self.removed_chain.push(self.chain[i]);
      }
    }

    visualizer.queue.push({
      type: "svgd-pf-step",
      x: self.chain,
      x_removed: self.show_removed ? self.removed_chain : [],
      gradx: self.gradx,
      h: self.h,
    });

    self.chain = new_chain;
    self.n = new_chain.length;
    

    self.iter++;
  },
});
