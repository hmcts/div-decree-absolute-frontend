const modulePath = 'steps/apply-for-da/ApplyForDA.step';
const ApplyForDA = require(modulePath);

const idam = require('services/idam');
const Done = require('steps/done/Done.step');
// eslint-disable-next-line max-len
const Exit = require('steps/petitioner/exit-no-longer-wants-to-proceed/ExitNoLongerWantsToProceed.step');
// eslint-disable-next-line max-len
const { middleware, question, sinon, content, custom, expect } = require('@hmcts/one-per-page-test-suite');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');

const caseOrchestrationService = require('services/caseOrchestrationService');

const session = { case: { data: {} } };

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ApplyForDA, [ idam.protect() ]);
  });

  it('renders the content', () => {
    const options = { ignoreContent: ['signOut'] };
    return content(ApplyForDA, session, options);
  });

  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(ApplyForDA, session, {}, { onlyErrors });
  });

  it('redirects to Done page if answered yes', () => {
    const fields = {
      applyForDA: 'yes'
    };
    return question.redirectWithField(ApplyForDA, fields, Done, session);
  });

  it('redirects to ExitNoLongerWantsToProceed if answered no', () => {
    const fields = {
      applyForDA: 'no'
    };
    return question.redirectWithField(ApplyForDA, fields, Exit);
  });

  describe('errors', () => {
    beforeEach(() => {
      sinon.stub(caseOrchestrationService, 'submitApplication');
      sinon.spy(caseOrchestrationHelper, 'handleErrorCodes');
    });

    afterEach(() => {
      caseOrchestrationService.submitApplication.restore();
      caseOrchestrationHelper.handleErrorCodes.restore();
    });

    it('shows error if does not answer question', () => {
      const onlyErrors = ['required'];
      return question.testErrors(ApplyForDA, session, {}, { onlyErrors });
    });

    it('calls caseOrchestrationHelper.handleErrorCodes on failure', () => {
      const error = new Error('An error has occoured on the Case Orchestartion Service');
      error.statusCode = INTERNAL_SERVER_ERROR;
      caseOrchestrationService.submitApplication.rejects(error);
      return custom(ApplyForDA)
        .withField('applyForDA', 'yes')
        .get()
        .expect(INTERNAL_SERVER_ERROR)
        .text(pageContent => {
          expect(pageContent.indexOf(error) !== -1).to.eql(true);
          return expect(caseOrchestrationHelper.handleErrorCodes.calledOnce).to.eql(true);
        });
    });
  });
});
