const basicDivorceSession = require('test/resources/basic-divorce-session');

Feature('Test all pages');

Scenario('Pages', async I => {
  await I.createAUser();

  await I.createDaCaseForUser(basicDivorceSession);

  I.amOnLoadedPage('/');

  await I.testIdamPage();

  I.testProgressBar();

  I.testApplyForDecreeAbsolutePage();

  I.testDonePage();

  await I.testExitPage();

  I.testContactDivorceTeamError();

  I.testCookiesPolicyPage();

  I.testPrivacyPolicyPage();

  I.testTermsAndConditionsPage();

  I.checkUrlsNotTested();
}).retry(3);
