const modulePath = 'steps/petitioner/progress-bar/ProgressBar.step';
const ProgressBar = require(modulePath);
const Exit = require('steps/exit/Exit.step');
const idam = require('services/idam');
const { custom, expect, middleware,
  sinon, redirect, stepAsInstance } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');

const templates = {
  awaitingDecreeAbsolute:
        './sections/ThreeCirclesFilledIn.html',
  divorceGranted:
        './sections/FourCirclesFilledIn.html'
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
    const session = {
      case: {
        state: 'AwaitingDecreeAbsolute',
        data: {
          d8: [
            {
              fileName: 'd8petition1554740111371638.pdf'
            },
            {
              fileName: 'certificateOfEntitlement1559143445687032.pdf'
            },
            {
              fileName: 'costsOrder1559143445687032.pdf'
            },
            {
              fileName: 'decreeNisi1559143445687032.pdf'
            }
          ]
        }
      }
    };

    it('should render guidance links', () => {
      return custom(ProgressBar)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.column-one-third').html();
          expect(rightHandSideMenu).to.include('Guidance on GOV.UK')
            .and.to.include('Get a divorce')
            .and.to.include('Children and divorce')
            .and.to.include('Money and property');
        });
    });

    it('should expect download documents', () => {
      const instance = stepAsInstance(ProgressBar, session);

      const fileTypes = instance.downloadableFiles.map(file => {
        return file.type;
      });

      expect(fileTypes).to.eql([
        'dpetition',
        'certificateOfEntitlement',
        'costsOrder',
        'decreeNisi'
      ]);
    });
  });

  // Test if all progressbar templates are rendered properly

  describe('CCD state: AwaitingDecreeAbsolute', () => {
    const session = {
      case: {
        state: 'AwaitingDecreeAbsolute'
      }
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingDecreeAbsolute);
    });
  });

  describe('CCD state: DivorceGranted', () => {
    const session = {
      case: {
        state: 'DivorceGranted'
      }
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.divorceGranted);
    });
  });

  describe('navigation', () => {
    it('goes to Exit page:', () => {
      const session = {};
      return redirect.navigatesToNext(ProgressBar, Exit, session);
    });
  });
});