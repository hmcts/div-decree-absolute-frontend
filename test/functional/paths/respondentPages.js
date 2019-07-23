const basicDivorceSession = require('test/resources/basic-divorce-session');

Feature('Test all pages for Respondent Journey');

Scenario('Pages', async I => {
  await I.createAUser();

  await I.createDaCaseForUser(basicDivorceSession);

  I.amOnLoadedPage('/');

  await I.testIdamPageForRespondent();

  I.testRespProgressBar();

  I.testContactDivorceTeamError();

  I.testCookiesPolicyPage();

  I.testPrivacyPolicyPage();

  I.testTermsAndConditionsPage();

  I.checkUrlsNotTested();
}).retry(3);
