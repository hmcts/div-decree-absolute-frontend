const basicDivorceSession = require('test/resources/basic-divorce-session');
const randomString = require('randomstring');

const emailPrefix = randomString.generate({
  length: 16,
  charset: 'numeric'
});

basicDivorceSession.D8PetitionerEmail = emailPrefix + basicDivorceSession.D8PetitionerEmail;
basicDivorceSession.RespEmailAddress = emailPrefix + basicDivorceSession.RespEmailAddress;


async function testRespondentJourney(I, language = 'en') {
  await I.createAUser(basicDivorceSession.RespEmailAddress);

  await I.createDaCaseInDaRequestedForUser(basicDivorceSession);

  I.amOnLoadedPage('/');

  await I.testIdamPageForRespondent();

  I.testRespProgressBar(language);

  I.testContactDivorceTeamError(language);

  I.testCookiesPolicyPage(language);

  I.testPrivacyPolicyPage(language);

  I.testTermsAndConditionsPage(language);

  I.checkUrlsNotTested();
}

Feature('Test all pages for Respondent Journey');

Scenario('Pages with English language preference', async I => {
  await testRespondentJourney(I, 'en');
}).retry(3);

Scenario('Pages with Welsh language preference', async I => {
  await testRespondentJourney(I, 'cy');
}).retry(3);
