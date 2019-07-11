const basicDivorceSession = require('test/resources/basic-divorce-session');

Feature('Test all pages');

Scenario('Pages', async I => {
  await I.createAUser();

  await I.createDnCaseForUser(basicDivorceSession);

  I.amOnLoadedPage('/');

  await I.testIdamPage();

  I.testProgressBar();

  I.testApplyForDecreeAbsolutePage();
  /*
  re add missing tests
   */

  I.testDonePage();

  await I.testExitPage();

  I.testContactDivorceTeamError();

  I.testCookiesPolicyPage();

  I.testPrivacyPolicyPage();

  I.testTermsAndConditionsPage();

  I.checkUrlsNotTested();
}).retry(3);
