const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');

class ProgressBar extends Interstitial {
  static get path() {
    return config.paths.progressBar;
  }

  get session() {
    return this.req.session;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }

  next() {
    return goTo(this.journey.steps.Exit);
  }
}

module.exports = ProgressBar;
