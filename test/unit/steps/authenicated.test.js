const modulePath = 'steps/authenticated/Authenticated.step';

const Authenticated = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, redirect } = require('@hmcts/one-per-page-test-suite');
const ProgressBar = require('steps/progress-bar/ProgressBar.step');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'landingPage').callsFake(middleware.nextMock);
  });

  afterEach(() => {
    idam.landingPage.restore();
  });

  it('has idam middleware', () => {
    return middleware.hasMiddleware(Authenticated, [ idam.landingPage ]);
  });

  it('to protected page', () => {
    return redirect.navigatesToNext(Authenticated, ProgressBar);
  });
});
