const request = require('request-promise-native');
const config = require('config');
const logger = require('services/logger').getLogger(__filename);
const caseOrchestrationHelper = require('helpers/caseOrchestrationHelper');

const authTokenString = '__auth-token';

const getCase = (req, uri, headers) => {
  return request.get({ uri, headers, json: true })
    .then(response => {
      logger.infoWithReq(req, 'case_retrieved',
        'Successfully retrieved case'
      );
      return caseOrchestrationHelper.validateResponse(req, response);
    })
    .then(response => {
      logger.infoWithReq(req, 'case_validated',
        'Successfully validated case'
      );
      return Object.assign(req.session, { case: response });
    });
};

const methods = {
  getApplication: req => {
    // no need to fetch case if we already have it
    if (req.session.case) {
      return Promise.resolve();
    }

    const uri = `${config.services.orchestrationService.getCaseUrl}`;
    const aosUri = `${config.services.orchestrationService.getAosCaseUrl}`;
    const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };

    return getCase(req, uri, headers)
      .catch(() => {
        logger.infoWithReq(req, 'no petitioner case found, trying to get respondent case');
        return getCase(req, aosUri, headers)
          .catch(error => {
            logger.errorWithReq(req, 'error_get_application', 'user has no case');
            throw error;
          });
      });
  },
  submitApplication: req => {
    const { caseId } = req.session.case;

    const uri = `${config.services.orchestrationService.submitCaseUrl}/${caseId}`;
    const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };
    const body = caseOrchestrationHelper.formatSessionForSubmit(req);
    return request.post({ uri, headers, json: true, body })
      .then(response => {
        logger.infoWithReq(req, 'application_submitted',
          'Successfully submitted DN case'
        );
        return response;
      })
      .catch(error => {
        logger.errorWithReq(req, 'error_submitting_application',
          'Error submitting case to case orchestration service',
          error.message
        );
        throw error;
      });
  },

  //  Triggers the amend application process
  amendApplication: req => {
    const { caseId } = req.session.case;
    const uri = `${config.services.orchestrationService.amendPetitionUrl}/${caseId}`;
    const headers = { Authorization: `Bearer ${req.cookies[authTokenString]}` };
    return request.put({ uri, headers, json: true })
      .catch(error => {
        logger.errorWithReq(req, 'error_amending_application',
          'Error sending request to case orchestration service amend application endpoint',
          error.message
        );
        throw error;
      });
  }
};

module.exports = methods;
