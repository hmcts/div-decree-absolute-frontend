const DonePage = require('steps/done/Done.step');
const DoneContent = require('steps/done/Done.content');

function testDonePage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(DonePage.path, language);

  I.waitInUrl(DonePage.path);

  I.see(DoneContent[language].youAreNowDivorced);
}

module.exports = { testDonePage };
