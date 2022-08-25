const modulePath = 'steps/privacy-policy/PrivacyPolicy.step';

const PrivacyPolicy = require(modulePath);
const { middleware, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has no middleware', () => {
    return middleware.hasMiddleware(PrivacyPolicy, []);
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

      return content(PrivacyPolicy, {}, { ignoreContent });
    });
  });
});
