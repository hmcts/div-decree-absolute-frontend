const glob = require('glob');

const steps = [];

glob.sync(`${__dirname}/**/*.step.js`).forEach(file => {
  const step = require(file); // eslint-disable-line global-require

  steps.push(step);
});

module.exports = steps;
