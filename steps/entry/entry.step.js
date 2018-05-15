const { goTo, EntryPoint } = require('@hmcts/one-per-page');
const { authenticate } = require('services/idam');
const config = require('config');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.entry;
  }

  next() {
    return goTo(this.journey.steps.Protected);
  }

  get middleware() {
    return [...super.middleware, authenticate()];
  }
}

module.exports = Entry;
