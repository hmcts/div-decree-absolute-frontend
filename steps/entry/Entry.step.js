const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.index;
  }

  get middleware() {
    return [...super.middleware, idam.authenticate];
  }

  next() {
    return action(caseOrchestrationService.getApplication)
      .then(redirectTo(this.journey.steps.ProgressBar))
      .onFailure(caseOrchestrationHelper.handleErrorCodes);
  }
}

module.exports = Entry;
