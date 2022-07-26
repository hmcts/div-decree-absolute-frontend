const basicDivorceSession = require('test/resources/basic-divorce-session');
const randomString = require('randomstring');

const emailPrefix = randomString.generate({
  length: 16,
  charset: 'numeric'
});

basicDivorceSession.D8PetitionerEmail = emailPrefix + basicDivorceSession.D8PetitionerEmail;
basicDivorceSession.RespEmailAddress = emailPrefix + basicDivorceSession.RespEmailAddress;


async function testRespondentJourney(I, language = 'en') {
  await I.retry(2).createAUser(basicDivorceSession.RespEmailAddress);
  I.wait(2);
  await I.retry(2).createDaCaseInDaRequestedForUser(basicDivorceSession);

  await I.amOnLoadedPage('/', language);

  await I.testIdamPageForRespondent();

  I.testRespProgressBar(language);
}

Feature('Test all pages for Respondent Journey');

Scenario('Pages with English language preference', async I => {
  await testRespondentJourney(I, 'en');
}).retry(3);

Scenario('Pages with Welsh language preference', async I => {
  await testRespondentJourney(I, 'cy');
}).retry(3);
