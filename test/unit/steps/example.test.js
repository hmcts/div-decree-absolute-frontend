const example = require('steps/example/Example.step');
const { content } = require('@hmcts/one-per-page-test-suite');

describe('Start Page', () => {
  it('renders the page on GET', () => {
    return content(example);
  });
});
