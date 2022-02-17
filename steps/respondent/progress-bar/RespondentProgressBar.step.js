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
      const caseId = this.case.caseReference;
      const caseState = this.currentCaseState;
      const rawDaGrantedDate = this.case.decreeAbsoluteGrantedDate;
      const daGrantedDate = new Date(rawDaGrantedDate);
      const docRemovalDate = new Date(daGrantedDate.setFullYear(daGrantedDate.getFullYear() + 1));
      const today = new Date();
      if (today > docRemovalDate) {
        logger.info(`
                           ========================================================================
                            No Files Available
                            ------------------
                            CaseId: ${caseId}
                            State: ${caseState}
                            Divorce Granted Date (Raw): ${rawDaGrantedDate}
                            Divorce Granted Date (JS Date): ${daGrantedDate}
                            Doc Removal Date: ${docRemovalDate}
                            Current Date: ${today}
                           ========================================================================
        `);
        return [];
      }
      logger.info(JSON.stringify(this.case));
      /*
      logger.info(`
                         ========================================================================
                          Files Available
                          ---------------
                          CaseId: ${caseId}
                          State: ${caseState}
                          Divorce Granted Date (Raw): ${rawDaGrantedDate}
                          Divorce Granted Date (JS Date): ${daGrantedDate}
                          Doc Removal Date: ${docRemovalDate}
                          Current Date: ${today}
                         ========================================================================
      `);
      */
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
