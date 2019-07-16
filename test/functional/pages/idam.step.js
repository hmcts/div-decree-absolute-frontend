const IdamMockLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const content = require('mocks/steps/idamLogin/IdamLogin.content');
const ProgressBarPage = require('steps/petitioner/progress-bar/ProgressBar.step');
const idamConfigHelper = require('test/functional/helpers/idamConfigHelper.js');

async function testIdamPage(success = true) {
  const I = this;

  I.amOnLoadedPage('/');

  const currentPath = await I.getCurrentUrl();
  if (currentPath !== ProgressBarPage.path) {
    if (currentPath === IdamMockLogin.path) {
      I.seeCurrentUrlEquals(IdamMockLogin.path);
      if (success) {
        I.checkOption(content.en.fields.success.yes);
      } else {
        I.checkOption(content.en.fields.success.no);
      }
      I.navByClick('Continue');
    } else {
      await I.seeInCurrentUrl('/login?');
      I.fillField('username', idamConfigHelper.getTestEmail());
      I.fillField('password', idamConfigHelper.getTestPassword());
      I.navByClick('Sign in');
      I.wait(3);
    }
  }

  I.seeCurrentUrlEquals(ProgressBarPage.path);
}

module.exports = { testIdamPage };
