const basicDivorceSession = require('test/resources/basic-divorce-session');
const randomString = require('randomstring');

const emailPrefix = randomString.generate({
  length: 16,
  charset: 'numeric'
});

basicDivorceSession.D8PetitionerEmail = emailPrefix + basicDivorceSession.D8PetitionerEmail;
basicDivorceSession.RespEmailAddress = emailPrefix + basicDivorceSession.RespEmailAddress;

Feature('Test all pages for Petitioner Journey');

Scenario('Pages', async I => {
  await I.createAUser(basicDivorceSession.D8PetitionerEmail);

  await I.createDaCaseForUser(basicDivorceSession);

  I.amOnLoadedPage('/');

  await I.testIdamPageForPetitioner();

  I.testPetProgressBar();

  I.testApplyForDecreeAbsolutePage();

  I.testDonePage();

  await I.testExitPage();

  I.testContactDivorceTeamError();

  I.testCookiesPolicyPage();

  I.testPrivacyPolicyPage();

  I.testTermsAndConditionsPage();

  I.testAccessibilityStatementPage();

  I.checkUrlsNotTested();
}).retry(3);
