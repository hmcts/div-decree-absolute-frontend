const ApplyForDecreeAbsolute = require('steps/petitioner/apply-for-da/ApplyForDecreeAbsolute.step');
const ApplyForDecreeAbsoluteContent = require(
  'steps/petitioner/apply-for-da/ApplyForDecreeAbsolute.content');
const ProgressBar = require('steps/petitioner/progress-bar/PetitionerProgressBar.step');

function testApplyForDecreeAbsolutePage() {
  const I = this;

  I.amOnLoadedPage(ApplyForDecreeAbsolute.path);

  I.checkOption(ApplyForDecreeAbsoluteContent.en.fields.applyForDecreeAbsolute.yes);

  I.navByClick(ApplyForDecreeAbsoluteContent.en.submit);

  I.seeCurrentUrlEquals(ProgressBar.path);
}

module.exports = { testApplyForDecreeAbsolutePage };
