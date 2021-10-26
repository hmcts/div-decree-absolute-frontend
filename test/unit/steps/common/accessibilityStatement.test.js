const modulePath = 'steps/accessibility-statement/AccessibilityStatement.step';

const PrivacyPolicy = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
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
      'script'
    ];
    return content(PrivacyPolicy, {}, { ignoreContent });
  });
});
