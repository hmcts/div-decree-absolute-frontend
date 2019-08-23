const modulePath = 'steps/exit/Exit.step';

const Exit = require(modulePath);
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
    return middleware.hasMiddleware(Exit, [ idam.protect(), idam.logout() ]);
  });

  describe('values', () => {
    it('displays Correct details', () => {
      const ignoreContent = [
        'continue',
        'serviceName',
        'backLink',
        'signOut',
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours'
      ];

      return content(Exit, {}, { ignoreContent });
    });
  });
});
