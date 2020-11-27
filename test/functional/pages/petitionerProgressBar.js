/* eslint-disable max-len */
const ProgressBarStep = require('steps/petitioner/progress-bar/PetitionerProgressBar.step');
const ProgressBarStepContent = require('steps/petitioner/progress-bar/PetitionerProgressBar.content');

function testPetProgressBar(language = 'en') {
  const I = this;

  I.amOnLoadedPage(ProgressBarStep.path, language);

  I.waitInUrl(ProgressBarStep.path);

  I.see(ProgressBarStepContent[language].title);
}

module.exports = { testPetProgressBar };
