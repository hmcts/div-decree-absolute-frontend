const { goTo, Redirect } = require('@hmcts/one-per-page');
const { landingPage } = require('services/idam');
const config = require('config');

class Authenticated extends Redirect {
  static get path() {
    return config.paths.authenticated;
  }

  next() {
    return goTo(this.journey.steps.Protected);
  }

  get middleware() {
    return [...super.middleware, landingPage()];
  }
}

module.exports = Authenticated;
