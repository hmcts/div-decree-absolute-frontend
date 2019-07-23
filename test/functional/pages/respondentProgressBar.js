/* eslint-disable max-len */
const ProgressBarStep = require('steps/respondent/progress-bar/RespondentProgressBar.step');
const ProgressBarStepContent = require('steps/respondent/progress-bar/RespondentProgressBar.content');

function testRespProgressBar() {
  const I = this;

  I.amOnLoadedPage(ProgressBarStep.path);

  I.see(ProgressBarStepContent.en.title);
}

module.exports = { testRespProgressBar };
