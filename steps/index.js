const glob = require('glob');
const config = require('config');

const steps = [];

glob.sync(`${__dirname}/**/*.step.js`).forEach(file => {
  const step = require(file); // eslint-disable-line global-require

  steps.push(step);
});

if (config.environment === 'development') {
  glob.sync(`${__dirname}/../mocks/steps/**/*.step.js`).forEach(file => {
    const step = require(file); // eslint-disable-line global-require

    steps.push(step);
  });
}

module.exports = steps;
