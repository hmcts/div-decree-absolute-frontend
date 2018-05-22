const example = require('steps/example/Example.step');
const test = require('@hmcts/one-per-page-test-suite');

describe('Start Page', () => {
  it('renders the page on GET', () => {
    return test.content(example);
  });
});
