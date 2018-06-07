const modulePath = 'mocks/services/idam';

const idam = require(modulePath);
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

let req = {};
let res = {};
let next = {};
const idamArgs = {
  idamLoginUrl: 'idam.login.url',
  indexUrl: 'application.index.url'
};

describe(modulePath, () => {
  beforeEach(() => {
    req = { session: {} };
    next = sinon.stub();
    res = { redirect: sinon.stub() };
  });

  describe('#authenticate', () => {
    it('runs next and adds idam object if authenticated', () => {
      req.session.IdamLogin = { success: 'yes' };
      const middleware = idam.authenticate(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledOnce(next);
      expect(req.hasOwnProperty('idam')).to.eql(true);
      expect(req.idam.hasOwnProperty('userDetails')).to.eql(true);
    });

    it('redirects to idamLoginUrl if not authenticated', () => {
      req.session.IdamLogin = { success: 'no' };
      const middleware = idam.authenticate(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledWith(res.redirect, idamArgs.idamLoginUrl);
    });
  });

  describe('#landingPage', () => {
    it('runs next and adds idam object if authenticated', () => {
      req.session.IdamLogin = { success: 'yes' };
      const middleware = idam.landingPage(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledOnce(next);
      expect(req.hasOwnProperty('idam')).to.eql(true);
      expect(req.idam.hasOwnProperty('userDetails')).to.eql(true);
    });

    it('redirects to idamLoginUrl if not authenticated', () => {
      req.session.IdamLogin = { success: 'no' };
      const middleware = idam.landingPage(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledWith(res.redirect, idamArgs.indexUrl);
    });
  });

  describe('#protect', () => {
    it('runs next and adds idam object if authenticated', () => {
      req.session.IdamLogin = { success: 'yes' };
      const middleware = idam.protect(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledOnce(next);
      expect(req.hasOwnProperty('idam')).to.eql(true);
      expect(req.idam.hasOwnProperty('userDetails')).to.eql(true);
    });

    it('redirects to idamLoginUrl if not authenticated', () => {
      req.session.IdamLogin = { success: 'no' };
      const middleware = idam.protect(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledWith(res.redirect, idamArgs.indexUrl);
    });
  });

  describe('#logout', () => {
    it('runs next and removes idam object', () => {
      req.session.IdamLogin = { success: 'yes' };
      req.idam = { userDetails: { id: 'idam.user.id' } };
      const middleware = idam.logout(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledOnce(next);
      expect(req.hasOwnProperty('idam')).to.eql(false);
      expect(req.session.hasOwnProperty('IdamLogin')).to.eql(false);
    });

    it('runs next and removes idam object', () => {
      req.session.IdamLogin = { success: 'no' };
      req.idam = { userDetails: { id: 'idam.user.id' } };
      const middleware = idam.logout(idamArgs);
      middleware(req, res, next);
      sinon.assert.calledOnce(next);
      expect(req.hasOwnProperty('idam')).to.eql(true);
      expect(req.idam.hasOwnProperty('userDetails')).to.eql(true);
    });
  });
});
