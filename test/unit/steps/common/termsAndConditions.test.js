const modulePath = 'steps/terms-and-conditions/TermsAndConditions.step';

const TermsAndConditions = require(modulePath);
const { middleware, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('has no middleware', () => {
    return middleware.hasMiddleware(TermsAndConditions, []);
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
        'wife'
      ];

      return content(TermsAndConditions, {}, { ignoreContent });
    });
  });
});
