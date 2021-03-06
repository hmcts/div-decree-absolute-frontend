const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');
const idam = require('services/idam');

class Exit extends ExitPoint {
  static get path() {
    return config.paths.exit;
  }

  get middleware() {
    return [
      idam.protect(),
      ...super.middleware,
      idam.logout()
    ];
  }
}

module.exports = Exit;
