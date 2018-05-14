const healthcheck = require('@hmcts/nodejs-healthcheck');
const config = require('config');
const os = require('os');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const ioRedis = require('ioredis');
const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');
const { OK } = require('http-status-codes');

const options = {
  timeout: config.health.timeout,
  deadline: config.health.deadline
};

const client = ioRedis.createClient(
  config.services.redis.url,
  { enableOfflineQueue: false }
);
client.on('error', error => {
  logger.error(error);
});

const checks = {
  redis: healthcheck.raw(() => {
    return client.ping().then(_ => {
      return healthcheck.status(_ === 'PONG');
    })
      .catch(error => {
        logger.error(`Health check failed on redis: ${error}`);
      });
  }),
  'idam-authentication': healthcheck.web(config.services.idamAuthentication.health, {
    callback: (error, res) => { // eslint-disable-line id-blacklist
      if (error) {
        logger.error(`Health check failed on idam-authentication: ${error}`);
      }
      return !error && res.status === OK ? outputs.up() : outputs.down(error);
    }
  }, options),
  'idam-app': healthcheck.web(config.services.idamApp.health, {
    callback: (error, res) => { // eslint-disable-line id-blacklist
      if (error) {
        logger.error(`Health check failed on idam-app: ${error}`);
      }
      return !error && res.status === OK ? outputs.up() : outputs.down(error);
    }
  }, options)
};

const setupHealthChecks = app => {
  app.use(config.paths.health, healthcheck.configure({
    checks,
    buildInfo: {
      name: config.service.name,
      host: os.hostname(),
      uptime: process.uptime()
    }
  }));
};

module.exports = setupHealthChecks;
