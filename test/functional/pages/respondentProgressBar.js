/* eslint-disable max-len */
const ProgressBarStep = require('steps/respondent/progress-bar/RespondentProgressBar.step');
const ProgressBarStepContent = require('steps/respondent/progress-bar/RespondentProgressBar.content');

function testRespProgressBar(language) {
  const I = this;

  I.amOnLoadedPage(ProgressBarStep.path, language);

  I.see(ProgressBarStepContent[language].title);
}

module.exports = { testRespProgressBar };
