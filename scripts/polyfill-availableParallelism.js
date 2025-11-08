const os = require('os');

// Polyfill for Node versions < 18 which don't have os.availableParallelism()
if (typeof os.availableParallelism !== 'function') {
  Object.defineProperty(os, 'availableParallelism', {
    value: function availableParallelism() {
      try {
        const cpus = os.cpus();
        if (!cpus || !cpus.length) return 1;
        // conservative default: number of CPUs (don't overcommit)
        return Math.max(1, cpus.length);
      } catch (e) {
        return 1;
      }
    },
    writable: false,
    configurable: true,
  });
}
