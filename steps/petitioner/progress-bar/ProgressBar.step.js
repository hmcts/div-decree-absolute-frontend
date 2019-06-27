const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const logger = require('services/logger').getLogger(__filename);
const config = require('config');
const idam = require('services/idam');

const progressStates = {
  awaitingDecreeAbsolute: 'awaitingDecreeAbsolute',
  divorceGranted: 'divorceGranted',
  other: 'other'
};

const caseStateMap = [
  {
    template: './sections/ThreeCirclesFilledIn.html',
    state: ['AwaitingDecreeAbsolute']
  },
  {
    template: './sections/FourCirclesFilledIn.html',
    state: ['DivorceGranted']
  }
];

class ProgressBar extends Interstitial {
  static get path() {
    return config.paths.petitioner.progressBar;
  }

  get session() {
      console.log(this.req.session);
    return this.req.session;
  }

  get progressStates() {
    return progressStates;
  }

  get case() {
    return this.req.session.case.data;
  }

  get middleware() {
    return [
      ...super.middleware,
      idam.protect()
    ];
  }

  next() {
    return goTo(this.journey.steps.Exit);
  }

  getProgressBarContent() {
    const caseState = this.session.case.state;

    if (this.awaitingDA(caseState)) {
      return this.progressStates.awaitingDecreeAbsolute;
    } else if (this.divorceGranted(caseState)) {
      return this.progressStates.divorceGranted;
    }

    logger.errorWithReq(this.req, 'progress_bar_content', 'No valid case state for ProgressBar page', caseState);
    return this.progressStates.other;
  }

  awaitingDA(caseState) {
    return caseState === config.caseStates.AwaitingDecreeAbsolute;
  }

  divorceGranted(caseState) {
    return caseState === config.caseStates.DivorceGranted;
  }

  get currentCaseState() {
    return this.req.session.case.state;
  }

  // Select the co-responding template depending on case states
  // decides which circles should be filled in - either 3 or 4
  get stateTemplate() {
    let template = '';
    caseStateMap.forEach(dataMap => {
      if (dataMap.state.includes(this.currentCaseState)) {
        template = dataMap.template;
      }
    });
    if (template === '') {
      template = './sections/ThreeCirclesFilledIn.html';
    }
    return template;
  }
}

module.exports = ProgressBar;
