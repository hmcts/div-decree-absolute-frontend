const { Interstitial } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page/flow');
const config = require('config');
const idam = require('services/idam');

const progressStates = {
  notDivorced: 'notDivorced',
  divorced: 'Divorced'
};

const caseStateMap = [
  {
    template: './sections/ThreeCirclesFilledIn.html',
    state: ['notDivorced']
  },
  {
    template: './sections/FourCirclesFilledIn.html',
    state: ['Divorced']
  }
];

class ProgressBar extends Interstitial {
  static get path() {
    return config.paths.petitioner.progressBar;
  }

  get session() {
    return this.req.session;
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
  get progressStates() {
    return progressStates;
  }

  get currentCaseState() {
    // obviously will be changed but just to demonstrate the idea
    // return this.req.session.caseState;

    // return 'Divorced';
    return 'notDivorced';
  }

  getProgressBarContent() {
    // will be replaced once we're able to properly retrieve session data
    // const caseState = this.session.caseState;

    // we will use the current case state to decide what content to display the user
    // refer to RFE to see how we will properly implement this

    return this.progressStates.notDivorced;
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
