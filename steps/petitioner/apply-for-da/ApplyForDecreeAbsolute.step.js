const { Question } = require('@hmcts/one-per-page');
const { redirectTo, action } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');
const caseOrchestrationService = require('services/caseOrchestrationService');
const removeNonCurrentStepErrors = require('middleware/removeNonCurrentStepErrors');

class ApplyForDecreeAbsolute extends Question {
  static get path() {
    return config.paths.petitioner.applyForDecreeAbsolute;
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

    return action((req, res) => {
      const promise = caseOrchestrationService.submitApplication(req, res);

      promise.then(response => {
        req.session.case.state = response.state;
      });

      return promise;
    })
      .then(redirectTo(this.journey.steps.PetitionerProgressBar))
      .onFailure((error, req, res, next) => {
        next(error);
      });
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect(),
      removeNonCurrentStepErrors
    ];
  }
}

module.exports = ApplyForDecreeAbsolute;
