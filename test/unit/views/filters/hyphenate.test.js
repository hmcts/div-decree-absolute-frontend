const modulePath = 'views/filters/hyphenate';

const { expect } = require('@hmcts/one-per-page-test-suite');
const filter = require(modulePath);

const Entities = require('html-entities').AllHtmlEntities;

describe(modulePath, () => {
  it('number should be hyphenated', () => {
    const hyphenatedNumber = '1234‐5678‐9090‐8908';
    const number = '1234567890908908';
    const filteredNumber = new Entities().decode(filter.hyphenate(number));
    expect(filteredNumber).to.eql(hyphenatedNumber);
  });
});