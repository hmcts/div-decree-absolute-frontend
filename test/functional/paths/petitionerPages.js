const basicDivorceSession = require('test/resources/basic-divorce-session');
const randomString = require('randomstring');

const emailPrefix = randomString.generate({
  length: 16,
  charset: 'numeric'
});

basicDivorceSession.D8PetitionerEmail = emailPrefix + basicDivorceSession.D8PetitionerEmail;
basicDivorceSession.RespEmailAddress = emailPrefix + basicDivorceSession.RespEmailAddress;


async function testPetitionerJourney(I, language = 'en') {
  await I.retry(2).createAUser(basicDivorceSession.D8PetitionerEmail);
  I.wait(2);
  await I.retry(2).createDaCaseForUser(basicDivorceSession);

  I.amOnLoadedPage('/', language);

  await I.testIdamPageForPetitioner();

  I.testPetProgressBar(language);

  I.testApplyForDecreeAbsolutePage(language);

  I.testDonePage(language);

  await I.testExitPage(language);
}

Feature('Test all pages for Petitioner Journey');

Scenario('Pages with English language preference', async I => {
  await testPetitionerJourney(I, 'en');
}).retry(3);

Scenario('Pages with Welsh language preference', async I => {
  await testPetitionerJourney(I, 'cy');
}).retry(3);
