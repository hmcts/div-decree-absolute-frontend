const IdamMockLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const content = require('mocks/steps/idamLogin/IdamLogin.content');
const PetProgressBarPage = require('steps/petitioner/progress-bar/PetitionerProgressBar.step');
const RespProgressBarPage = require('steps/respondent/progress-bar/RespondentProgressBar.step');
const idamConfigHelper = require('test/functional/helpers/idamConfigHelper.js');

async function testIdamPageForPetitioner(success = true) {
  const I = this;

  I.amOnLoadedPage('/');

  const currentPath = await I.getCurrentUrl();
  if (currentPath !== PetProgressBarPage.path) {
    if (currentPath === IdamMockLogin.path) {
      I.seeCurrentUrlEquals(IdamMockLogin.path);
      if (success) {
        I.checkOption(content.en.fields.success.yesPetitioner);
      } else {
        I.checkOption(content.en.fields.success.no);
      }
      I.navByClick('Continue');
    } else {
      await I.waitInUrl('/login?');
      I.seeInCurrentUrl('/login?');
      I.fillField('username', idamConfigHelper.getTestEmail());
      I.fillField('password', idamConfigHelper.getTestPassword());
      I.navByClick('Sign in');
      I.wait(3);
    }
  }

  I.waitInUrl(PetProgressBarPage.path);
  I.seeCurrentUrlEquals(PetProgressBarPage.path);
}

async function testIdamPageForRespondent(success = true) {
  const I = this;

  I.amOnLoadedPage('/');

  const currentPath = await I.getCurrentUrl();
  if (currentPath !== RespProgressBarPage.path) {
    if (currentPath === IdamMockLogin.path) {
      I.seeCurrentUrlEquals(IdamMockLogin.path);
      if (success) {
        I.checkOption(content.en.fields.success.yesRespondent);
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

  I.seeCurrentUrlEquals(RespProgressBarPage.path);
}

module.exports = { testIdamPageForPetitioner, testIdamPageForRespondent };
