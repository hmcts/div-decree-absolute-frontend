const caseStates = {
  daRequested: 'darequested',
  divorceGranted: 'divorcegranted'
};

const contentMap = {
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
