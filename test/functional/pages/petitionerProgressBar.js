/* eslint-disable max-len */
const ProgressBarStep = require('steps/petitioner/progress-bar/PetitionerProgressBar.step');
const ProgressBarStepContent = require('steps/petitioner/progress-bar/PetitionerProgressBar.content');

function testPetProgressBar() {
  const I = this;

  I.amOnLoadedPage(ProgressBarStep.path);

  I.see(ProgressBarStepContent.en.title);
}

module.exports = { testPetProgressBar };
