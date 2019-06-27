const modulePath = 'steps/entry/Entry.step';
const Entry = require(modulePath);
const ProgressBar = require('steps/petitioner/progress-bar/ProgressBar.step');
const idam = require('services/idam');
const { middleware, redirect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Entry, [ idam.authenticate ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'authenticate').callsFake(middleware.nextMock);
    });

    afterEach(() => {
      idam.authenticate.restore();
    });

    it('to ProgressBar page', () => {
      return redirect.navigatesToNext(Entry, ProgressBar);
    });
  });
});
