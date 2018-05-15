const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');

class Idam extends Question {
  get form() {
    const answers = ['yes', 'no'];
    const validAnswers = Joi.string()
      .valid(answers)
      .required();

    const success = text.joi(this.content.errors.required, validAnswers);

    return form({ success });
  }

  next() {
    return goTo(this.journey.steps.Authenticated);
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

module.exports = Idam;
