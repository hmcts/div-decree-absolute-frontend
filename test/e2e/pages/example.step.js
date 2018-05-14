const ExamplePage = require('steps/example/example.step.js');

function seeExamplePage() {
  const I = this;

  I.seeCurrentUrlEquals(ExamplePage.url);
  I.see('Continue');
  I.click('Continue');
}

module.exports = { seeExamplePage };
