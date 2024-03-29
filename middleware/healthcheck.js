const healthcheck = require('@hmcts/nodejs-healthcheck');
const config = require('config');
const os = require('os');
const logger = require('services/logger').getLogger(__filename);
const redis = require('services/redis');
const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');
const { OK } = require('http-status-codes');

const healthOptions = message => {
  return {
    callback: (error, res) => { // eslint-disable-line id-blacklist
      if (error) {
        logger.errorWithReq(null, 'health_check_error', message, error);
      }
      return !error && res.status === OK ? outputs.up() : outputs.down(error);
    },
    timeout: config.health.timeout,
    deadline: config.health.deadline
  };
};

const checks = () => {
  return {
    redis: healthcheck.raw(() => {
      return redis.ping().then(_ => {
        return healthcheck.status(_ === 'PONG');
      })
        .catch(error => {
          logger.errorWithReq(null, 'health_check_error', 'Health check failed on redis', error);
          return false;
        });
    }),
    'case-orchestration-service': healthcheck.web(`${config.services.orchestrationService.baseUrl}/health`,
      healthOptions('Health check failed on case-orchestration-service:')
    ),
    'fees-and-payments-service': healthcheck.web(`${config.services.feesAndPayments.url}/health`,
      healthOptions('Health check failed on fees-and-payments-service:')
    ),
    'evidence-management-client': healthcheck.web(`${config.services.evidenceManagementClient.url}/health`,
      healthOptions('Health check failed on evidence-management-client:')
    )
  };
};

const setupHealthChecks = app => {
  healthcheck.addTo(app, {
    checks: checks(),
    buildInfo: {
      name: config.service.name,
      host: os.hostname(),
      uptime: process.uptime()
    }
  });
};

module.exports = setupHealthChecks;
