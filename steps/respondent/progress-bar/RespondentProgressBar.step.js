const ProgressBar = require('common/steps/progress-bar/ProgressBar.step.js');
const config = require('config');
const { createUris } = require('@hmcts/div-document-express-handler');

const {
  caseStates,
  contentMap,
  progressBarMap
} = require('./stateTemplates');

class RespondentProgressBar extends ProgressBar {
  static get path() {
    return config.paths.respondent.progressBar;
  }

  get downloadableFiles() {
    const docConfig = {
      documentNamePath: config.document.documentNamePath,
      documentWhiteList: config.document.filesWhiteList.respondent
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
    /* eslint-disable indent */
    switch (this.currentCaseState.toLowerCase()) {
      case caseStates.daRequested:
        pageContent = contentMap.daRequested;
        break;
      default:
        pageContent = contentMap.divorceGranted;
    }
    /* eslint-enable indent */
    return pageContent;
  }
}

module.exports = RespondentProgressBar;
