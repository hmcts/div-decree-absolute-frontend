/* eslint-disable max-len */
const modulePath = 'steps/petitioner/exit-no-longer-wants-to-proceed/ExitNoLongerWantsToProceed.step';

const Exit = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect and idam.logout middleware', () => {
    return middleware.hasMiddleware(Exit, [ idam.protect(), idam.logout() ]);
  });
});
