const { Question, branch } = require('@hmcts/one-per-page');
const { redirectTo, action, goTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');

const caseOrchestrationService = require('services/caseOrchestrationService');

class ApplyForDA extends Question {
  static get path() {
    return config.paths.applyForDA;
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

    const applyForDA = text
      .joi(this.content.errors.required, validAnswers);

    return form({ applyForDA });
  }

  next() {
    const declinesToApplyForDA = () => {
      return this.fields.applyForDA.value === 'no';
    };

    return branch(
      redirectTo(this.journey.steps.ExitNoLongerWantsToProceed)
        .if(declinesToApplyForDA),
      action(caseOrchestrationService.submitApplication)
        .then(goTo(this.journey.steps.Done))
        .onFailure((error, req, res) => {
          const { session } = req;
          // push error into session to display error message to user
          session.temp = { ApplyForDA: Object.assign({}, session.ApplyForDA, { submitError: 'error' }) };
          return redirectTo(this.journey.steps.ApplyForDA)
            .redirect(req, res);
        })
    );
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = ApplyForDA;
