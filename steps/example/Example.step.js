const { Page, goTo } = require('@hmcts/one-per-page');
const config = require('config');

class Example extends Page {
  static get path() {
    return config.paths.index;
  }

  next() {
    return goTo(this.journey.steps.Entry);
  }
}

module.exports = Example;
