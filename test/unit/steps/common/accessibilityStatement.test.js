const modulePath = 'steps/accessibility-statement/AccessibilityStatement.step';

const PrivacyPolicy = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
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
    return content(PrivacyPolicy, {}, { ignoreContent });
  });
});