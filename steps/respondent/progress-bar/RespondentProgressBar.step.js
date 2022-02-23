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
    // If divorce was granted > 1 year ago, do not return docs for respondent download
    if (this.currentCaseState.toLowerCase() === caseStates.divorceGranted) {
      // Get decree absolute granted date
      const daGrantedDate = new Date(this.case.decreeAbsoluteGrantedDate);
      // Doc removal date is 1 year after decree absolute granted date
      const docRemovalDate = new Date(daGrantedDate.setFullYear(daGrantedDate.getFullYear() + 1));
      // If we have passed the doc removal date, return an empty array instead of the file list
      const today = new Date();
      if (today > docRemovalDate) {
        return [];
      }
    }
    // if divorce was not yet granted, or was granted less than one year ago, return the array of docs for respondent download
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
}

module.exports = RespondentProgressBar;
