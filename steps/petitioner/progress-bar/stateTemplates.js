const caseStates = {
  AwaitingDA: 'awaitingDecreeAbsolute',
  DARequested: 'daRequested',
  DAGranted: 'divorceGranted'
};

const contentMap = [
  {
    template: './sections/DivorceAwaiting.html',
    state: ['awaitingDecreeAbsolute']
  },
  {
    template: './sections/DivorceRequested.html',
    state: ['daRequested']
  },
  {
    template: './sections/DivorceGranted.html',
    state: ['divorceGranted']
  }
];

const progressBarMap = [
  {
    template: './sections/ThreeCirclesFilledIn.html',
    state: [caseStates.AwaitingDA, caseStates.DARequested]
  },
  {
    template: './sections/FourCirclesFilledIn.html',
    state: [caseStates.DAGranted]
  }
];

module.export = {
  caseStates,
  contentMap,
  progressBarMap
};
