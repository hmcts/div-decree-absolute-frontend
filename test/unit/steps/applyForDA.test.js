const modulePath = 'steps/apply-for-da/ApplyForDA.step';
const ApplyForDA = require(modulePath);

const Done = require('steps/done/Done.step');
// eslint-disable-next-line max-len
const Exit = require('steps/petitioner/exit-no-longer-wants-to-proceed/ExitNoLongerWantsToProceed.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

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
    });

    afterEach(() => {
      caseOrchestrationService.submitApplication.restore();
    });

    it('shows error if does not answer question', () => {
      const onlyErrors = ['required'];
      return question.testErrors(ApplyForDA, session, {}, { onlyErrors });
    });

    it('shows error if case submission fails', () => {
      caseOrchestrationService.submitApplication.rejects();
      const fields = { applyForDA: 'yes' };
      const onlyErrors = ['submitError'];
      return question.testErrors(ApplyForDA, session, fields, { onlyErrors });
    });
  });
});
