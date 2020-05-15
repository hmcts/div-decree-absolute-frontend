/* eslint-disable max-len */
const modulePath = 'steps/petitioner/exit-no-longer-wants-to-proceed/ExitNoLongerWantsToProceed.step';

const ExitNoLongerWantsToProceed = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect and idam.logout middleware', () => {
    return middleware.hasMiddleware(ExitNoLongerWantsToProceed, [ idam.protect(), idam.logout() ]);
  });


  describe('Sign out page when user selects no', () => {
    const ignoreContent = [
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'continue',
      'serviceName',
      'backLink',
      'signOut',
      'languageToggle'
    ];

    it('displays issue date', () => {
      const session = {
        case: {
          state: 'AwaitingPronouncement',
          data: {
            divorceWho: 'husband',
            dateRespondentEligibleForDa: ['2019-09-24T00:00:00.000Z'],
            dateCaseNoLongerEligibleForDa: ['2020-05-11T00:00:00.000Z']
          }
        }
      };
      return content(ExitNoLongerWantsToProceed, session, { ignoreContent });
    });
  });
});
