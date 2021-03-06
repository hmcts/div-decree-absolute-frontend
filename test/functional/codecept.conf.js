/* eslint-disable no-process-env */
const config = require('config');

const waitForTimeout = config.tests.functional.waitForTimeout;
const waitForAction = config.tests.functional.waitForAction;
const chromeArgs = [ '--no-sandbox' ];

const proxyServer = config.tests.functional.proxy;
if (proxyServer) {
  chromeArgs.push(`--proxy-server=${proxyServer}`);
}

const proxyByPass = config.tests.functional.proxyByPass;
if (proxyByPass) {
  chromeArgs.push(`--proxy-bypass-list=${proxyByPass}`);
}

exports.config = {
  tests: './paths/**/*.js',
  output: `${process.cwd()}/functional-output`,
  helpers: {
    Puppeteer: {
      url: config.tests.functional.url || config.node.baseUrl,
      waitForTimeout,
      waitForAction,
      show: config.tests.functional.show,
      chrome: {
        ignoreHTTPSErrors: true,
        args: chromeArgs
      }
    },
    ElementExist: { require: './helpers/elementExist.js' },
    IdamHelper: { require: './helpers/idamHelper.js' },
    CaseHelper: { require: './helpers/caseHelper.js' },
    JSWait: { require: './helpers/JSWait.js' },
    UrlHelper: { require: './helpers/urlHelper.js' }
  },
  include: { I: './pages/steps.js' },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: { mochaFile: './functional-output/result.xml' }
      },
      mochawesome: {
        stdout: './functional-output/console.log',
        options: {
          reportDir: process.env.E2E_OUTPUT_DIR || './functional-output',
          reportName: 'DecreeAbsoluteFrontendTests',
          inlineAssets: true
        }
      }
    }
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true
    }
  },
  name: 'Decree Absolute Frontend Tests'
};
