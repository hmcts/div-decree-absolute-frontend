const ProgressBar = require('common/steps/progress-bar/ProgressBar.step.js');
const config = require('config');
const { createUris } = require('@hmcts/div-document-express-handler');
const checkWelshToggle = require('middleware/checkWelshToggle');

const {
  caseStates,
  contentMap,
  progressBarMap
} = require('./stateTemplates');

class PetitionerProgressBar extends ProgressBar {
  static get path() {
    return config.paths.petitioner.progressBar;
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: config.document.filesWhiteList.petitioner
    };

    return createUris(this.case.d8, docConfig);
  }

  get stateTemplate() {
    if (this.currentCaseState.toLowerCase() === caseStates.divorceGranted) {
      return progressBarMap.fourCirclesFilledIn;
    }
    return progressBarMap.threeCirclesFilledIn;
  }

  get pageContentTemplate() {
    let pageContent = '';
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
    return pageContent;
  }

  get middleware() {
    return [
      ...super.middleware,
      checkWelshToggle
    ];
  }
}

module.exports = PetitionerProgressBar;
