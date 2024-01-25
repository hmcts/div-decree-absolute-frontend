const modulePath = 'steps/petitioner/apply-for-da/ApplyForDecreeAbsolute.step';
const ApplyForDA = require(modulePath);
const idam = require('services/idam');
// eslint-disable-next-line max-len
const { middleware, question, sinon, content, custom, expect } = require('@hmcts/one-per-page-test-suite');
// eslint-disable-next-line max-len
const Exit = require('steps/petitioner/exit-no-longer-wants-to-proceed/ExitNoLongerWantsToProceed.step');

const caseOrchestrationService = require('services/caseOrchestrationService');
const { MOVED_TEMPORARILY } = require('http-status-codes');
const ProgressBar = require('steps/petitioner/progress-bar/PetitionerProgressBar.step');

const PRE_STATE = 'AwaitingDecreeAbsolute';
const POST_STATE = 'DARequested';

const session = {
  case: {
    state: PRE_STATE,
    data: {}
  }
};

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(caseOrchestrationService, 'submitApplication');
    session.case.state = PRE_STATE;
  });

  afterEach(() => {
    idam.protect.restore();
    caseOrchestrationService.submitApplication.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ApplyForDA, [idam.protect()]);
  });

  it('renders the content', () => {
    const options = { ignoreContent: [
      'continue',
      'signIn',
      'signOut',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'languageToggle',
      'thereWasAProblem',
      'husband',
      'wife',
      'phoneToCallIfProblems'
    ] };
    return content(ApplyForDA, session, options);
  });

  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(ApplyForDA, session, {}, { onlyErrors });
  });

  it('redirects to ProgressBar page if answered yes', () => {
    caseOrchestrationService.submitApplication.resolves({ state: POST_STATE });

    return custom(ApplyForDA)
      .withSession(session)
      .withField('applyForDecreeAbsolute', 'yes')
      .post()
      .expect(MOVED_TEMPORARILY)
      .expect('Location', ProgressBar.path)
      .expect(() => {
        expect(session.case.state).to.be.equal(POST_STATE);
      });
  });

  it('redirects to ExitNoLongerWantsToProceed if answered no', () => {
    const fields = {
      applyForDecreeAbsolute: 'no'
    };
    return question.redirectWithField(ApplyForDA, fields, Exit)
      .expect(() => expect(caseOrchestrationService.submitApplication.notCalled).to.be.true);
  });

  describe('errors', () => {
    it('shows error if does not answer question', () => {
      const onlyErrors = ['required'];
      return question.testErrors(ApplyForDA, session, {}, { onlyErrors });
    });
  });
});
