const modulePath = 'steps/entry/Entry.step';

const Entry = require(modulePath);
const ProgressBar = require('steps/petitioner/progress-bar/ProgressBar.step');
const idam = require('services/idam');
const { middleware, redirect, sinon, custom, expect } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');

describe(modulePath, () => {
  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Entry, [ idam.authenticate ]);
  });

  context('navigation', () => {
    beforeEach(() => {
      sinon.stub(idam, 'authenticate').callsFake(middleware.nextMock);
      sinon.stub(caseOrchestrationService, 'getApplication');
      sinon.spy(caseOrchestrationHelper, 'handleErrorCodes');
    });

    afterEach(() => {
      idam.authenticate.restore();
      caseOrchestrationService.getApplication.restore();
      caseOrchestrationHelper.handleErrorCodes.restore();
    });

    it('to PetitionProgressBar page', () => {
      caseOrchestrationService.getApplication.resolves();
      return redirect.navigatesToNext(Entry, ProgressBar, null);
    });

    it('calls caseOrchestrationHelper.handleErrorCodes on failure', () => {
      const error = new Error('An error has occurred on the Case Orchestration Service');
      error.statusCode = INTERNAL_SERVER_ERROR;
      caseOrchestrationService.getApplication.rejects(error);
      return custom(Entry)
        .get()
        .expect(INTERNAL_SERVER_ERROR)
        .text(pageContent => {
          expect(pageContent.indexOf(error) !== -1).to.eql(true);
          return expect(caseOrchestrationHelper.handleErrorCodes.calledOnce).to.eql(true);
        });
    });
  });
});
