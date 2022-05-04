const ProgressBar = require('common/steps/progress-bar/ProgressBar.step.js');
const config = require('config');
const { createUris } = require('@hmcts/div-document-express-handler');

const {
  caseStates,
  contentMap,
  progressBarMap
} = require('./stateTemplates');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

class RespondentProgressBar extends ProgressBar {
  static get path() {
    return config.paths.respondent.progressBar;
  }

  get downloadableFiles() {
    const caseId = this.case.caseReference;
    if (caseId === config.hideDocsForCase) {
      return [];
    }

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

  get petitionerInferredRelationship() {
    // eslint-disable-next-line max-len
    const respondentInferredRelationship = this.req.session.case.data.divorceWho.toLowerCase();
    const marriageIsSameSexCouple = this.req.session.case.data.marriageIsSameSexCouple.toLowerCase() === 'yes';

    if (marriageIsSameSexCouple) {
      return respondentInferredRelationship;
    } else if (respondentInferredRelationship === 'husband') {
      return 'wife';
    }
    return 'husband';
  }

  get pageContentTemplate() {
    let pageContent = '';
    /* eslint-disable indent */
    if (this.currentCaseState.toLowerCase() === caseStates.daRequested) {
      pageContent = contentMap.daRequested;
    } else {
      pageContent = contentMap.divorceGranted;
    }

    return pageContent;
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours
    ];
  }
}

module.exports = RespondentProgressBar;
