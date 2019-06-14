const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const ProgressBar = require('steps/progress-bar/ProgressBar.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has idam.landingPage middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ idam.landingPage() ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'landingPage').returns(middleware.nextMock);
    });

    afterEach(() => {
      idam.landingPage.restore();
    });

    it('to protected page', () => {
      return redirect.navigatesToNext(Authenticated, ProgressBar);
    });
  });
});
