const modulePath = 'steps/petitioner/progress-bar/ProgressBar.step';
const ProgressBar = require(modulePath);
const Exit = require('steps/exit/Exit.step');
const idam = require('services/idam');
const { custom, expect, middleware,
  sinon, redirect, stepAsInstance } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');

const templates = {
  notDivorced: './sections/ThreeCirclesFilledIn.html'
};


describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ProgressBar, [idam.protect()]);
  });

  describe('right hand side menu rendering', () => {
    const session = {};

    it('should render guidance links', () => {
      return custom(ProgressBar)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.column-one-third').html();
          expect(rightHandSideMenu).to.include('Guidance on GOV.UK')
            .and.to.include('Responding to a divorce application')
            .and.to.include('Decree nisi')
            .and.to.include('Decree absolute')
            .and.to.include('Children and divorce')
            .and.to.include('Money and property');
        });
    });
  });

  // Test if all progressbar templates are rendered properly

  describe('CCD state: NotDivorce', () => {
    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar);
      expect(instance.stateTemplate).to.eql(templates.notDivorced);
    });
  });

  describe('navigation', () => {
    it('goes to exit page', () => {
      return redirect.navigatesToNext(ProgressBar, Exit);
    });
  });
});