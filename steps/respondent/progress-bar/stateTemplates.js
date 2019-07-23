const caseStates = {
  awaitingDA: 'awaitingdecreeabsolute',
  daRequested: 'darequested',
  divorceGranted: 'divorcegranted'
};

const contentMap = {
  awaitingDA: './sections/DivorceAwaiting.html',
  daRequested: './sections/DivorceRequested.html',
  divorceGranted: './sections/DivorceGranted.html'
};

const progressBarMap = {
  threeCirclesFilledIn: './sections/ThreeCirclesFilledIn.html',
  fourCirclesFilledIn: './sections/FourCirclesFilledIn.html'
};

module.exports = {
  caseStates,
  contentMap,
  progressBarMap
};
