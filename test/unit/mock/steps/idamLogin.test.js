const modulePath = 'mocks/steps/idamLogin/IdamLogin.step';

const IdamLogin = require(modulePath);
const Authenticated = require('steps/authenticated/Authenticated.step');
const { question, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the page on GET', () => {
    const ignoreContent = [
      'serviceName',
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

    return content(IdamLogin, {}, { ignoreContent });
  });

  it('redirects to Authenticated if answer is no', () => {
    const fields = { success: 'no' };
    return question.redirectWithField(IdamLogin, fields, Authenticated);
  });

  it('redirects to Authenticated if answer is yes - login as Petitioner', () => {
    const fields = { success: 'yesPetitioner' };
    return question.redirectWithField(IdamLogin, fields, Authenticated);
  });

  it('redirects to Authenticated if answer is yes - login as Respondent', () => {
    const fields = { success: 'yesPetitioner' };
    return question.redirectWithField(IdamLogin, fields, Authenticated);
  });

  it('loads fields from the session', () => {
    const sessionData = { success: 'yesPetitioner' };
    return question.rendersValues(IdamLogin, sessionData);
  });
});
