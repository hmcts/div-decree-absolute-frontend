const glob = require('glob');

const getSteps = () => {
  const steps = [];

  glob.sync('steps/**/*.step.js').forEach(file => {
    const step = require(file); // eslint-disable-line global-require

    steps.push(step);
  });

  return steps;
};

module.exports = getSteps;
