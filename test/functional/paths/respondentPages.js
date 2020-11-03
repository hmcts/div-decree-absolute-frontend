const basicDivorceSession = require('test/resources/basic-divorce-session');
const randomString = require('randomstring');

const emailPrefix = randomString.generate({
  length: 16,
  charset: 'numeric'
});

basicDivorceSession.D8PetitionerEmail = emailPrefix + basicDivorceSession.D8PetitionerEmail;
basicDivorceSession.RespEmailAddress = emailPrefix + basicDivorceSession.RespEmailAddress;

Feature('Test all pages for Respondent Journey');

Scenario('Pages', async I => {
  await I.createAUser(basicDivorceSession.RespEmailAddress);

  await I.createDaCaseInDaRequestedForUser(basicDivorceSession);

  I.amOnLoadedPage('/');

  await I.testIdamPageForRespondent();

  I.testRespProgressBar('en');

  I.testContactDivorceTeamError();

  I.testCookiesPolicyPage();

  I.testPrivacyPolicyPage();

  I.testTermsAndConditionsPage();

  I.checkUrlsNotTested();
}).retry(3);

Scenario('Pages', async I => {
  await I.createAUser(basicDivorceSession.RespEmailAddress);

  await I.createDaCaseInDaRequestedForUser(basicDivorceSession);

  I.amOnLoadedPage('/');

  await I.testIdamPageForRespondent();

  I.testRespProgressBar('cy');

  I.testContactDivorceTeamError();

  I.testCookiesPolicyPage();

  I.testPrivacyPolicyPage();

  I.testTermsAndConditionsPage();

  I.checkUrlsNotTested();
}).retry(3);
