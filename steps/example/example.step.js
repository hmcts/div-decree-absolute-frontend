const { Page } = require('@hmcts/one-per-page');

class Example extends Page {
  static get path() {
    return '/';
  }
}

module.exports = Example;
