const { Redirect } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');

class Authenticated extends Redirect {
  static get path() {
    return config.paths.authenticated;
  }

  get middleware() {
    return [
      idam.landingPage,
      ...super.middleware
    ];
  }

  next() {
    return redirectTo(this.journey.steps.Entry);
  }
}

module.exports = Authenticated;
