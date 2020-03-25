const modulePath = 'steps/contact-divorce-team-error/ContactDivorceTeamError.step';

const ContactDivorceTeam = require(modulePath);
const { content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the content', () => {
    const ignoreContent = [
      'continue',
      'backLink',
      'signOut',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'signIn'
    ];
    return content(ContactDivorceTeam, {}, { ignoreContent });
  });
});
