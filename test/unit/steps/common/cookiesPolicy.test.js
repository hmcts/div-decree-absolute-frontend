const modulePath = 'steps/cookies-policy/CookiesPolicy.step';

const CookiesPolicy = require(modulePath);
const { middleware, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has no middleware', () => {
    return middleware.hasMiddleware(CookiesPolicy, []);
  });

  describe('values', () => {
    it('displays correct details', () => {
      const ignoreContent = [
        'continue',
        'serviceName',
        'backLink',
        'signIn',
        'signOut',
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'languageToggle',
        'thereWasAProblem',
        'husband',
        'wife',
        'phoneToCallIfProblems'
      ];

      return content(CookiesPolicy, {}, { ignoreContent });
    });
  });
});
