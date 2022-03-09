const modulePath = 'steps/respondent/progress-bar/RespondentProgressBar.step';
const ProgressBar = require(modulePath);
const ApplyForDA = require('steps/petitioner/apply-for-da/ApplyForDecreeAbsolute.step');
// eslint-disable-next-line max-len
const respondentProgressBarContent = require('./../../../../steps/respondent/progress-bar/RespondentProgressBar.content');
const idam = require('services/idam');
const { custom, expect, middleware,
  sinon, redirect, stepAsInstance } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const config = require('config');

const progressBarTemplates = {
  divorceGranted:
        './sections/FourCirclesFilledIn.html'
};

const pageContentTemplates = {
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
          divorceWho: 'husband',
          marriageIsSameSexCouple: 'no',
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
            },
            {
              fileName: 'generalOrder1559143445687032.pdf'
            },
            {
              fileName: 'generalOrder1559143445687033.pdf'
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
          const rightHandSideMenu = $('.govuk-grid-column-one-third').html();
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
        'decreeAbsolute',
        'generalOrder',
        'generalOrder'
      ]);
    });

    it('should expect no download documents if caseId matches config.hideDocsForCase', () => {
      session.case.data.caseReference = config.hideDocsForCase;
      const instance = stepAsInstance(ProgressBar, session);

      const fileTypes = instance.downloadableFiles.map(file => {
        return file.type;
      });

      expect(fileTypes).to.eql([]);
    });
  });

  // Test if all progressbar templates are rendered properly
  describe('CCD state: DARequested', () => {
    const testSession = {
      case: {
        state: 'DARequested',
        data: {
          respEmailAddress: 'respondent@localhost.local',
          marriageIsSameSexCouple: 'no',
          divorceWho: 'husband'
        }
      }
    };

    it('renders the correct content template', () => {
      const instance = new ProgressBar(
        { journey: {},
          idam: idamDetails,
          session: testSession });
      expect(instance.pageContentTemplate).to.eql(pageContentTemplates.daRequested);
    });

    const testParams = {
      divorceHusbandAndSameSexCouple: {
        description: 'divorcing husband and same sex couple',
        marriageIsSameSexCouple: 'yes',
        divorceWho: 'husband',
        expectedTestPetitionerRelationship: 'husband'
      },
      divorceHusbandAndNotSameSexCouple: {
        description: 'divorcing husband and not a same sex couple',
        marriageIsSameSexCouple: 'no',
        divorceWho: 'husband',
        expectedTestPetitionerRelationship: 'wife'
      },
      divorceWifeAndSameSexCouple: {
        description: 'divorcing wife and same sex couple',
        marriageIsSameSexCouple: 'yes',
        divorceWho: 'wife',
        expectedTestPetitionerRelationship: 'wife'
      },
      divorceWifeAndNotSameSexCouple: {
        description: 'divorcing wife and not a same sex couple',
        marriageIsSameSexCouple: 'not',
        divorceWho: 'wife',
        expectedTestPetitionerRelationship: 'husband'
      }
    };

    // eslint-disable-next-line guard-for-in
    for (const testData in testParams) {
      describe(`for ${testParams[testData].description}`, () => {
        const session = {
          case: {
            state: 'DARequested',
            data: {
              respEmailAddress: 'respondent@localhost.local',
              marriageIsSameSexCouple: testParams[testData].marriageIsSameSexCouple,
              divorceWho: testParams[testData].divorceWho
            }
          }
        };

        // eslint-disable-next-line max-len,no-loop-func
        it(`petitionerInferredRelationship should be ${testParams[testData].expectedTestPetitionerRelationship}`,
          () => {
            const instance = stepAsInstance(ProgressBar, session);
            const result = instance.petitionerInferredRelationship;
            expect(result)
              .to
              .eql(testParams[testData].expectedTestPetitionerRelationship);
          });

        // eslint-disable-next-line max-len,no-loop-func
        it('renders expected content for DARequested landing page',
          () => {
            const respondentDARequested = respondentProgressBarContent.en.daRequested;
            // eslint-disable-next-line max-len
            const daTitle = `Your ${testParams[testData].expectedTestPetitionerRelationship} has applied for Decree Absolute`;
            // eslint-disable-next-line max-len
            const daDescription = respondentDARequested.daRequestedDescription;

            return custom(ProgressBar)
              .withSetup(setup)
              .withSession(session)
              .get()
              .expect(httpStatus.OK)
              .html($ => {
                const daRequestedContent = $('.da-requested-content')
                  .html();
                expect(daRequestedContent)
                  .to
                  .include(daTitle)
                  .and
                  .to
                  .include(daDescription);
              });
          });
      });
    }
  });

  describe('CCD state: DivorceGranted', () => {
    const session = {
      case: {
        state: 'DivorceGranted',
        data: {
          respEmailAddress: 'respondent@localhost.local',
          D8InferredPetitionerGender: 'male',
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
