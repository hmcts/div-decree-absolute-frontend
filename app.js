const config = require('config');
const express = require('express');
const path = require('path');
const onePerPage = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const logging = require('@hmcts/nodejs-logging');
const getSteps = require('steps');
const setupHelmet = require('middleware/helmet');
const setupPrivacy = require('middleware/privacy');
const setupHealthChecks = require('middleware/healthcheck');

const app = express();

console.log("REDIS URL", config.get('services.redis.url')); // eslint-disable-line
console.log("BASE URL", config.get('node.baseUrl')); // eslint-disable-line

setupHelmet(app);
setupPrivacy(app);
setupHealthChecks(app);

lookAndFeel.configure(app, {
  baseUrl: config.node.baseUrl,
  express: {
    views: [
      path.resolve(__dirname, 'mocks', 'steps'),
      path.resolve(__dirname, 'steps'),
      path.resolve(__dirname, 'views')
    ]
  },
  webpack: {
    entry: [
      path.resolve(__dirname, 'assets/js/main.js'),
      path.resolve(__dirname, 'assets/scss/main.scss')
    ]
  },
  nunjucks: {
    globals: {
      phase: 'ALPHA',
      feedbackLink: 'https://github.com/hmcts/one-per-page/issues/new'
    }
  }
});

onePerPage.journey(app, {
  baseUrl: config.node.baseUrl,
  steps: getSteps(),
  errorPages: {},
  session: {
    redis: { url: config.get('services.redis.url') },
    cookie: { secure: config.get('services.redis.useSSL') === 'true' },
    secret: config.get('services.redis.secret')
  }
});

app.use(logging.Express.accessLogger());

module.exports = app;
