const caseStateMap = [
  {
    template: './sections/DivorceAwaiting.html',
    state: ['AwaitingDecreeAbsolute']
  },
  {
    template: './sections/DivorceRequested.html',
    state: ['DARequested']
  },
  {
    template: './sections/DivorceGranted.html',
    state: ['DivorceGranted']
  }
];

module.export = { caseStateMap };
