const { Question } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/src/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const config = require('config');

class IdamLogin extends Question {
  static get path() {
    return config.paths.mock.idamLogin;
  }

  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const success = text.joi(this.content.errors.required, validAnswers);

    return form({ success });
  }

  next() {
    return redirectTo(this.journey.steps.Authenticated);
  }

  answers() {
    return answer(this, {
      section: 'idam',
      answer: this.fields.success.value
    });
  }

  values() {
    return { idam: { success: this.fields.success.value } };
  }
}

module.exports = IdamLogin;
