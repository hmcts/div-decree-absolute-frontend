const { pick } = require('lodash');

const removeNonCurrentStepErrors = (req, res, next) => {
  const currentStep = req.currentStep.name;
  // Errors are stored in temp. This clears all errors not associated with the current step.
  req.session.temp = pick(req.session.temp, [currentStep]);
  next();
};

module.exports = removeNonCurrentStepErrors;