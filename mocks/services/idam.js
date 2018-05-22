const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

const userDetails = {
  id: 'idamUserId',
  emai: 'idamUserEmailAddress'
};

const divIdamExpressMiddleware = {
  authenticate: idamArgs => {
    return (req, res, next) => {
      const mockIdamAuthenticated = req.session.hasOwnProperty('IdamLogin') && req.session.IdamLogin.success === 'yes';
      if (mockIdamAuthenticated) {
        req.idam = { userDetails };
        next();
      } else {
        res.redirect(idamArgs.idamLoginUrl);
      }
    };
  },

  landingPage: idamArgs => {
    return (req, res, next) => {
      const mockIdamAuthenticated = req.session.hasOwnProperty('IdamLogin') && req.session.IdamLogin.success === 'yes';
      if (mockIdamAuthenticated) {
        req.idam = { userDetails };
        next();
      } else {
        res.redirect(idamArgs.indexUrl);
      }
    };
  },

  protect: idamArgs => {
    return (req, res, next) => {
      const mockIdamAuthenticated = req.session.hasOwnProperty('IdamLogin') && req.session.IdamLogin.success === 'yes';
      if (mockIdamAuthenticated) {
        req.idam = { userDetails };
        next();
      } else {
        res.redirect(idamArgs.indexUrl);
      }
    };
  },

  logout: () => {
    return (req, res, next) => {
      const mockIdamAuthenticated = req.session.hasOwnProperty('IdamLogin') && req.session.IdamLogin.success === 'yes';
      if (mockIdamAuthenticated) {
        delete req.idam.IdamLogin;
        next();
      } else {
        logger.error('User failed to logout of idam');
        next();
      }
    };
  }
};

module.exports = divIdamExpressMiddleware;
