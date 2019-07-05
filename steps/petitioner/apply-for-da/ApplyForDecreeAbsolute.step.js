const { Question } = require('@hmcts/one-per-page');
const { redirectTo, action, goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');

const caseOrchestrationService = require('services/caseOrchestrationService');
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');
const removeNonCurrentStepErrors = require('middleware/removeNonCurrentStepErrors');

class ApplyForDecreeAbsolute extends Question {
  static get path() {
    return config.paths.applyForDecreeAbsolute;
  }
  get session() {
    return this.req.session;
  }

  get case() {
    return this.req.session.case.data;
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const applyForDecreeAbsolute = text
      .joi(this.content.errors.required, validAnswers);
    const submitError = text
      .joi(this.submitError, Joi.valid(['']));
    return form({ applyForDecreeAbsolute, submitError });
  }

  next() {
    const declinesToApplyForDA = () => {
      return this.fields.applyForDecreeAbsolute.value === 'no';
    };

    if (declinesToApplyForDA()) {
      return redirectTo(this.journey.steps.ExitNoLongerWantsToProceed);
    }

    return action(caseOrchestrationService.submitApplication)
      .then(goTo(this.journey.steps.Done))
      .onFailure(caseOrchestrationHelper.handleErrorCodes);
  }

  get middleware() {
    return [...super.middleware, idam.protect(), removeNonCurrentStepErrors];
  }
}

module.exports = ApplyForDecreeAbsolute;
