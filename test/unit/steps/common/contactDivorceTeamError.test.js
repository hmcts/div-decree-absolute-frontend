const modulePath = 'steps/contact-divorce-team-error/ContactDivorceTeamError.step';

const ContactDivorceTeam = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
    const ignoreContent = [
      'continue',
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
    return content(ContactDivorceTeam, {}, { ignoreContent });
  });
});
