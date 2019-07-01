const modulePath = 'steps/apply-for-da/ApplyForDA.step';

const ApplyForDAContent = require('steps/apply-for-da/ApplyForDA.content');  // eslint-disable-line

const ApplyForDA = require(modulePath);

const Done = require('steps/done/Done.step');
// eslint-disable-next-line max-len
const Exit = require('steps/petitioner/exit-no-longer-wants-to-proceed/ExitNoLongerWantsToProceed.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

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
    return content(ApplyForDA, session);
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

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      ApplyForDAContent.en.fields.applyForDA.title,
      ApplyForDAContent.en.fields.applyForDA.yes
    ];
    const stepData = { applyForDA: 'yes' };

    return question.answers(ApplyForDA, stepData, expectedContent, session);
  });

  it('returns correct answers if answered no', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      ApplyForDAContent.en.fields.applyForDA.title,
      ApplyForDAContent.en.fields.applyForDA.no
    ];

    const stepData = {
      applyForDA: 'no'
    };

    return question.answers(ApplyForDA, stepData, expectedContent, session);
  });
});
