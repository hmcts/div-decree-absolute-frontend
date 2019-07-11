const ProgressBarStep = require('steps/petitioner/progress-bar/ProgressBar.step');
const ProgressBarStepContent = require('steps/petitioner/progress-bar/ProgressBar.content');

function testProgressBar() {
  const I = this;

  I.amOnLoadedPage(ProgressBarStep.path);

  I.see(ProgressBarStepContent.en.title);
}

module.exports = { testProgressBar };
