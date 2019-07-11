const modulePath = 'steps/petitioner/apply-for-da/ApplyForDecreeAbsolute.step';
const ApplyForDA = require(modulePath);

const idam = require('services/idam');
const Done = require('steps/done/Done.step');
// eslint-disable-next-line max-len
const Exit = require('steps/petitioner/exit-no-longer-wants-to-proceed/ExitNoLongerWantsToProceed.step');
// eslint-disable-next-line max-len
const { middleware, question, sinon, content, custom, expect } = require('@hmcts/one-per-page-test-suite');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');

const caseOrchestrationService = require('services/caseOrchestrationService');

const session = { case: { data: {} } };

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(caseOrchestrationService, 'submitApplication');
  });

  afterEach(() => {
    idam.protect.restore();
    caseOrchestrationService.submitApplication.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ApplyForDA, [ idam.protect() ]);
  });

  it('renders the content', () => {
    const options = { ignoreContent: ['continue', 'signOut'] };
    return content(ApplyForDA, session, options);
  });

  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(ApplyForDA, session, {}, { onlyErrors });
  });

  it('redirects to Done page if answered yes', () => {
    caseOrchestrationService.submitApplication.resolves();
    const fields = {
      applyForDecreeAbsolute: 'yes'
    };
    return question.redirectWithField(ApplyForDA, fields, Done, session);
  });

  it('redirects to ExitNoLongerWantsToProceed if answered no', () => {
    const fields = {
      applyForDecreeAbsolute: 'no'
    };
    return question.redirectWithField(ApplyForDA, fields, Exit);
  });

  describe('errors', () => {
    it('shows error if does not answer question', () => {
      const onlyErrors = ['required'];
      return question.testErrors(ApplyForDA, session, {}, { onlyErrors });
    });

    it('calls caseOrchestrationHelper.handleErrorCodes on failure', () => {
      const error = new Error('An error has occoured on the Case Orchestartion Service');
      error.statusCode = INTERNAL_SERVER_ERROR;
      caseOrchestrationService.submitApplication.rejects(error);
      return custom(ApplyForDA)
        .withSetup(req => req.session.generate())
        .withField('applyForDecreeAbsolute', 'yes')
        .post()
        .expect(INTERNAL_SERVER_ERROR)
        .text(pageContent => {
          expect(pageContent.indexOf(error) !== -1).to.eql(true);
        });
    });
  });
});
