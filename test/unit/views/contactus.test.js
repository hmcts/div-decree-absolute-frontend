const PetitionProgressBar = require('steps/petitioner/progress-bar/PetitionerProgressBar.step');
const idam = require('services/idam');
const { middleware, sinon, content, custom, expect } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');

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
          fileName: 'dnAnswers1559143445687032.pdf'
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

describe('Test contact us for help', () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('shows email and phone content', () => {
    const specificContent = [
      'phoneTitle',
      'emailTitle',
      'emailIfProblems',
      'responseTime'
    ];
    return content(PetitionProgressBar, session, { specificContent });
  });

  xit('shows webchat content', () => {
    return custom(PetitionProgressBar)
      .withSession(session)
      .get()
      .expect(httpStatus.OK)
      .text(pageContent => {
        expect(pageContent).to.include('Talk to an Agent');
      });
  });
});
