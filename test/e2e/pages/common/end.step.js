const ExitPage = require('steps/exit/Exit.step');
const content = require('steps/exit/Exit.content');

function seeExitPage() {
  const I = this;

  I.seeCurrentUrlEquals(ExitPage.path);
  I.waitForText(content.en.title);
}

module.exports = { seeExitPage };
