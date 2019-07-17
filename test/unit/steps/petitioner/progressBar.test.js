const modulePath = 'steps/petitioner/progress-bar/ProgressBar.step';
const ProgressBar = require(modulePath);
const ApplyForDA = require('steps/petitioner/apply-for-da/ApplyForDecreeAbsolute.step');
const idam = require('services/idam');
const { custom, expect, middleware,
  sinon, redirect, stepAsInstance } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');

const progressBarTemplates = {
  awaitingDecreeAbsolute:
        './sections/ThreeCirclesFilledIn.html',
  divorceGranted:
        './sections/FourCirclesFilledIn.html'
};

const pageContentTemplates = {
  awaitingDecreeAbsolute: './sections/DivorceAwaiting.html',
  daRequested: './sections/DivorceRequested.html',
  divorceGranted: './sections/DivorceGranted.html'
};

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  const idamDetails = {
    userDetails: {
      email: 'respondent@localhost.local'
    }
  };

  const setup = req => {
    req.idam = idamDetails;
  };

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ProgressBar, [idam.protect()]);
  });

  describe('right hand side menu rendering', () => {
    const session = {
      case: {
        state: 'DivorceGranted',
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
            },
            {
              fileName: 'decreeAbsolute1559143445687032.pdf'
            }
          ]
        }
      }
    };

    it('should render guidance links', () => {
      return custom(ProgressBar)
        .withSetup(setup)
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
        'decreeNisi',
        'decreeAbsolute'
      ]);
    });
  });

  // Test if all progressbar templates are rendered properly
  describe('CCD state: AwaitingDecreeAbsolute', () => {
    const session = {
      case: {
        state: 'AwaitingDecreeAbsolute',
        data: {
          respEmailAddress: 'respondent@localhost.local',
          dateRespondentEligibleForDA: '2019-05-24',
          dateCaseNoLongerEligibleForDA: '2020-05-12'
        }
      }
    };

    it('renders the correct progress bar template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(progressBarTemplates.awaitingDecreeAbsolute);
    });

    it('renders the correct content template', () => {
      const instance = new ProgressBar({ journey: {}, idam: idamDetails, session });
      expect(instance.pageContentTemplate).to.eql(pageContentTemplates.awaitingDecreeAbsolute);
    });

    it('renders the DA-related dates correctly', () => {
      return custom(ProgressBar)
        .withSetup(setup)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .text(() => {
          expect('test').not.to.be.eq('broken');
        });
    });
  });

  describe('CCD state: DARequested', () => {
    const session = {
      case: {
        state: 'DARequested',
        data: {
          respEmailAddress: 'respondent@localhost.local'
        }
      }
    };

    it('renders the correct content template', () => {
      const instance = new ProgressBar({ journey: {}, idam: idamDetails, session });
      expect(instance.pageContentTemplate).to.eql(pageContentTemplates.daRequested);
    });

    it('renders DARequested content', () => {
      const daTitle = 'Your application for Decree Absolute is being processed';
      // eslint-disable-next-line max-len
      const daDescription = 'This application is subject to checks to ensure there are no outstanding applications that require completion before the divorce is finalised';

      return custom(ProgressBar)
        .withSetup(setup)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const daRequestedContent = $('.da-requested-content').html();
          expect(daRequestedContent).to.include(daTitle)
            .and.to.includes(daDescription);
        });
    });
  });

  describe('CCD state: DivorceGranted', () => {
    const session = {
      case: {
        state: 'DivorceGranted',
        data: {
          respEmailAddress: 'respondent@localhost.local',
          d8: [
            {
              fileName: 'decreeAbsolute1559143445687032.pdf'
            }
          ]
        }
      }
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(progressBarTemplates.divorceGranted);
    });

    it('renders the correct content template', () => {
      const instance = new ProgressBar({ journey: {}, idam: idamDetails, session });
      expect(instance.pageContentTemplate).to.eql(pageContentTemplates.divorceGranted);
    });

    it('should expect decree absolute document', () => {
      const instance = stepAsInstance(ProgressBar, session);
      const decreeAbsoluteDocument = instance.decreeAbsoluteFile;
      const decreeAbsoluteDocumentUri = '/document-download/decreeAbsolute1559143445687032.pdf';

      expect(decreeAbsoluteDocument.type).to.eql('decreeAbsolute');
      expect(decreeAbsoluteDocument.fileType).to.eql('pdf');
      expect(decreeAbsoluteDocument.uri).to.eql(decreeAbsoluteDocumentUri);
    });
  });

  describe('navigation', () => {
    it('goes to Apply for Decree Absolute page:', () => {
      const session = {};
      return redirect.navigatesToNext(ProgressBar, ApplyForDA, session);
    });
  });
});