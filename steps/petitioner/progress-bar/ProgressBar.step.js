const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');
const { createUris } = require('@hmcts/div-document-express-handler');
const removeNonCurrentStepErrors = require('middleware/removeNonCurrentStepErrors');

const {
  caseStates,
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

  get stateTemplate() {
    if (this.currentCaseState.toLowerCase() === caseStates.divorceGranted) {
      return progressBarMap.fourCirclesFilledIn;
    }
    return progressBarMap.threeCirclesFilledIn;
  }

  get pageContentTemplate() {
    let pageContent = '';
    /* eslint-disable indent */
    switch (this.currentCaseState.toLowerCase()) {
      case caseStates.daRequested:
        pageContent = contentMap.daRequested;
        break;
      case caseStates.divorceGranted:
        pageContent = contentMap.divorceGranted;
        break;
      default:
        pageContent = contentMap.awaitingDA;
    }
    /* eslint-enable indent */
    return pageContent;
  }
}

module.exports = ProgressBar;
