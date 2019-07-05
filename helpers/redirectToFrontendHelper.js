const config = require('config');
const logger = require('services/logger').getLogger(__filename);

const authTokenString = '__auth-token';

const redirectToUrl = (req, res, baseUrl) => {
  const queryString = `${baseUrl}?${authTokenString}=${req.cookies[authTokenString]}`;
  res.redirect(`${queryString}`);
};

const redirectToDN = (req, res) => {
  logger.infoWithReq(req, 'redirecting_to_decree_nisi', 'Redirecting user to DN. User is not in DA state');

  const dnFrontend = config.services.dnFrontend;
  redirectToUrl(req, res, `${dnFrontend.url}${dnFrontend.landing}`);
};

module.exports = { redirectToDN };
