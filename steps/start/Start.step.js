const { Page } = require('@hmcts/one-per-page');
const config = require('config');

class Start extends Page {
  static get path() {
    return config.paths.index;
  }
}

module.exports = Start;
