const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');
const checkWelshToggle = require('middleware/checkWelshToggle');
const i18next = require('i18next');
const commonContent = require('common/content');

class ExitNoLongerWantsToProceed extends ExitPoint {
  static get path() {
    return config.paths.petitioner.exitNoLongerWantsToProceed;
  }

  get case() {
    return this.req.session.case.data;
  }

  get divorceWho() {
    const sessionLanguage = i18next.language;
    return commonContent[sessionLanguage][this.req.session.case.data.divorceWho];
  }

  get middleware() {
    return [
      idam.protect(),
      idam.logout(),
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = ExitNoLongerWantsToProceed;
