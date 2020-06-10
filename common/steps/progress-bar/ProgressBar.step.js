const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const removeNonCurrentStepErrors = require('middleware/removeNonCurrentStepErrors');
const i18next = require('i18next');
const commonContent = require('common/content');

class ProgressBar extends Interstitial {
  get session() {
    return this.req.session;
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
      ...super.middleware,
      idam.protect(),
      removeNonCurrentStepErrors
    ];
  }

  next() {
    return goTo(this.journey.steps.ApplyForDecreeAbsolute);
  }

  get currentCaseState() {
    return this.req.session.case.state;
  }

  get decreeAbsoluteFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'decreeAbsolute';
    });
  }
}

module.exports = ProgressBar;
