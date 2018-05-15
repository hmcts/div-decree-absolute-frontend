const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const config = require('config');
const baseUrl = require('helpers/baseUrl');

const authenticatedUrl = config.paths.authenticated;
const redirectUri = `${baseUrl}${authenticatedUrl}`;
const idamArgs = {
  redirectUri,
  indexUrl: config.paths.index,
  idamApiUrl: config.services.idam.apiUrl,
  idamLoginUrl: config.services.idam.loginUrl,
  idamSecret: config.services.idam.secret,
  idamClientID: config.services.idam.clientId
};

let middleware = idamExpressMiddleware;
console.log('env', config.environment === 'development');
if (config.environment === 'development') {
  console.log('mockware');
  middleware = idamExpressMiddlewareMock;
}

const methods = {
  authenticate: (...args) => {
    return middleware.authenticate(idamArgs, ...args);
  },
  landingPage: (...args) => {
    console.log('landing');
    return middleware.landingPage(idamArgs, ...args);
  },
  protect: (...args) => {
    return middleware.protect(idamArgs, ...args);
  },
  logout: (...args) => {
    return middleware.logout(idamArgs, ...args);
  }
};

module.exports = methods;
