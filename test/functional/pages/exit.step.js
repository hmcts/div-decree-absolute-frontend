const ExitPage = require('steps/exit/Exit.step');
const ExitPageContent = require('steps/exit/Exit.content');

async function testExitPage(language) {
  const I = this;

  await I.testIdamPageForPetitioner();

  I.amOnLoadedPage(ExitPage.path, language);

  I.see(ExitPageContent[language].title);
}

module.exports = { testExitPage };
