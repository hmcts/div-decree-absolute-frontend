const PetitionProgressBar = require('steps/petitioner/progress-bar/PetitionerProgressBar.step');
const idam = require('services/idam');
const { middleware, sinon, content, custom, expect } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const { get } = require('lodash');

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
      'phoneToCallIfProblems',
      'emailTitle',
      'emailIfProblems',
      'responseTime'
    ];
    return content(PetitionProgressBar, session, { specificContent });
  });

  it('shows webchat content if enabled', () => {
    const features = { webchat: true };

    return custom(PetitionProgressBar)
      .withSession(session)
      .withGlobal('features', features)
      .get()
      .expect(httpStatus.OK)
      .text((pageContent, contentKeys) => {
        const webChatTitle = get(contentKeys, 'webChatTitle');

        expect(pageContent).to.include(webChatTitle);
      });
  });
});