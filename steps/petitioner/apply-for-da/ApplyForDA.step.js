const { Question, branch } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const config = require('config');
const idam = require('services/idam');
const Joi = require('joi');

class ApplyForDA extends Question {
  static get path() {
    return config.paths.petitioner.applyForDA;
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
      redirectTo(this.journey.steps.Done)
    );
  }

  get middleware() {
    return [...super.middleware, idam.protect()];
  }
}

module.exports = ApplyForDA;
