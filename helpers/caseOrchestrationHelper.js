const sessionToCosMapping = require('resources/sessionToCosMapping');
const { get } = require('lodash');
const config = require('config');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');
const { NOT_FOUND, MULTIPLE_CHOICES } = require('http-status-codes');

const REDIRECT_TO_DECREE_NISI_FE = Symbol('redirect_to_rfe');
const redirectToDecreeNisiError = new Error('User is in Decree Nisi state');
redirectToDecreeNisiError.statusCode = REDIRECT_TO_DECREE_NISI_FE;

const formatSessionForSubmit = req => {
  const { journey } = req;
  const sessionFieldPaths = Object.keys(sessionToCosMapping);

  const createRequestBody = (requestBody, sessionFieldPath) => {
    const sessionFieldPathAsArray = sessionFieldPath.split('.');

    // first item in array is the step class name
    const stepName = sessionFieldPathAsArray.shift();
    // rest of the items in array is path to field
    const fieldPath = sessionFieldPathAsArray.join('.');

    // get step that corresponds to the value in session
    const step = journey.instance(journey.steps[stepName]);

    // if step has been answered
    if (step && step.fields) {
      // retrieve all values as json for step
      const values = step.retrieve().values();
      // retrieve the field we need
      const value = get(values, fieldPath);

      // set a new key value pair based on mapping
      const ccdKey = sessionToCosMapping[sessionFieldPath];

      // only map the value that has been answered
      if (value) {
        requestBody[ccdKey] = value;
      } else {
        requestBody[ccdKey] = null;
      }
    }

    return requestBody;
  };

  return sessionFieldPaths.reduce(createRequestBody, {});
};

const validateResponse = (req, response) => {
  const userIsNotInDaState = !config.ccd.validDaStates.includes(response.state);

  switch (true) {
  case userIsNotInDaState:
    return Promise.reject(redirectToDecreeNisiError);
  default:
    return Promise.resolve(response);
  }
};

const handleErrorCodes = (error, req, res, next) => {
  switch (error.statusCode) {
  case NOT_FOUND:
  case REDIRECT_TO_DECREE_NISI_FE:
    redirectToFrontendHelper.redirectToDN(req, res);
    break;
  case MULTIPLE_CHOICES:
    res.redirect(config.paths.contactDivorceTeamError);
    break;
  default:
    next(error);
  }
};

module.exports = {
  formatSessionForSubmit,
  validateResponse,
  handleErrorCodes,
  redirectToDecreeNisiError
};
