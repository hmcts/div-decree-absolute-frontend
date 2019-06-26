const ProgressBar = require('steps/progress-bar/ProgressBar.step');
const content = require('steps/progress-bar/ProgressBar.content');

function seeProgressBarPage() {
  const I = this;

  I.seeCurrentUrlEquals(ProgressBar.path);
  I.waitForText(content.en.title);
}

module.exports = {
  seeProgressBarPage
};
