const ProgressBar = require('common/steps/progress-bar/ProgressBar.step.js');
const config = require('config');
const { createUris } = require('@hmcts/div-document-express-handler');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

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
      const caseState = this.currentCaseState;
      const caseId = this.case.caseId;
      const caseGrantedDate = this.case.decreeAbsoluteGrantedDate;
      const daGrantedDate = new Date(this.case.decreeAbsoluteGrantedDate);
      const docRemovalDate = new Date(daGrantedDate.setFullYear(daGrantedDate.getFullYear() + 1));
      const today = new Date();
      if (today > docRemovalDate) {
        logger.info(`
                           ===============================================
                           Case ID: ${caseId}
                           Case State: ${caseState}
                           No Files Available
                           DA Raw: ${caseGrantedDate}
                           DA Granted As JS Date: ${daGrantedDate}
                           ===============================================
                           `);
        const noFiles = {
          documentNamePath: config.document.documentNamePath,
          documentWhiteList: ['returnNothing']
        };
        return createUris(this.case.d8, noFiles);
      }
      logger.info(`===============================================
                         Case ID: ${caseId}
                         Case State: ${caseState}
                         Files Available
                         DA Raw: ${caseGrantedDate}
                         DA Granted As JS Date: ${daGrantedDate}
                         ===============================================
                         `);
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
}

module.exports = RespondentProgressBar;
