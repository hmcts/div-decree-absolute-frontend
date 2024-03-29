const { EntryPoint } = require('@hmcts/one-per-page');
const { action } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const caseOrchestrationService = require('services/caseOrchestrationService');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.index;
  }

  next() {
    return action(caseOrchestrationService.getApplication)
      .then((req, res) => {
        if (req.idam.userDetails.email.toLowerCase() === req.session.case.data.petitionerEmail.toLowerCase()) {
          return res.redirect(this.journey.steps.PetitionerProgressBar.path);
        }
        return res.redirect(this.journey.steps.RespondentProgressBar.path);
      })
      .onFailure(caseOrchestrationHelper.handleErrorCodes);
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.authenticate
    ];
  }
}

module.exports = Entry;
