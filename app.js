const config = require('config');
const express = require('express');
const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const logging = require('@hmcts/nodejs-logging');
const steps = require('steps');
const setupHelmet = require('middleware/helmet');
const setupPrivacy = require('middleware/privacy');
const setupHealthChecks = require('middleware/healthcheck');
const baseUrl = require('helpers/baseUrl');

const app = express();

setupHelmet(app);
setupPrivacy(app);
setupHealthChecks(app);

lookAndFeel.configure(app, {
  baseUrl,
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

journey(app, {
  baseUrl,
  steps,
  errorPages: {},
  session: {
    redis: { url: config.get('services.redis.url') },
    cookie: { secure: config.get('services.redis.useSSL') === 'true' },
    secret: config.get('services.redis.secret')
  }
});

app.use(logging.Express.accessLogger());

module.exports = app;
