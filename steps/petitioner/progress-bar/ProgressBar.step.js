const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const logger = require('services/logger').getLogger(__filename);
const config = require('config');
const idam = require('services/idam');
const { createUris } = require('@hmcts/div-document-express-handler');
const removeNonCurrentStepErrors = require('middleware/removeNonCurrentStepErrors');

const {
  contentMap,
  progressBarMap
} = require('./stateTemplates');

class ProgressBar extends Interstitial {
  static get path() {
    return config.paths.petitioner.progressBar;
  }

  get session() {
    return this.req.session;
  }

  get case() {
    return this.req.session.case.data;
  }

  get caseId() {
    return this.req.session.case.caseId;
  }

  get idamUserIsRespondent() {
    // eslint-disable-next-line max-len
    return this.req.idam.userDetails.email === this.req.session.case.data.respEmailAddress;
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

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: config.document.filesWhiteList
    };

    return createUris(this.case.d8, docConfig);
  }

  get decreeAbsoluteFile() {
    return this.downloadableFiles.find(file => {
      return file.type === 'decreeAbsolute';
    });
  }

  /**
   * Select the correct template to display based on the case state
   *
   * States:
   * AwaitingDecreeAbsolute = apply for DA content
   * DARequested = Processing page
   * DivorceGranted = Divorce granted page with direct link to DA certificate
   *
   * @returns {string}
   */
  get pageContentTemplate() {
    let pageContentTemplate = '';
    // eslint-disable-next-line max-len
    const isResp = this.req.idam.userDetails.email === this.req.session.case.data.respEmailAddress;
    if (isResp) {
      pageContentTemplate = './sections/DivorceGranted.html';
    } else {
      contentMap.forEach(dataMap => {
        if (dataMap.state.includes((this.currentCaseState))) {
          pageContentTemplate = dataMap.template;
        }
      });
    }
    return pageContentTemplate;
  }

  // Select the correct template based on case state
  // decides which circles should be filled in - either 3 or 4
  get stateTemplate() {
    let progressBarTemplate = '';
    // eslint-disable-next-line max-len
    const isResp = this.req.idam.userDetails.email === this.req.session.case.data.respEmailAddress;
    if (isResp) {
      progressBarTemplate = './sections/FourCirclesFilledIn.html';
    } else {
      progressBarMap.forEach(dataMap => {
        if (dataMap.state.includes(this.currentCaseState)) {
          progressBarTemplate = dataMap.template;
        }
      });
    }
    return progressBarTemplate || './sections/ThreeCirclesFilledIn.html';
  }
}

module.exports = ProgressBar;
