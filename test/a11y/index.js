const steps = require('steps')(false);
const { custom, expect } = require('@hmcts/one-per-page-test-suite');
const a11y = require('./a11y');
const resolveTemplate = require('@hmcts/one-per-page/src/middleware/resolveTemplate');
const config = require('config');

// ensure step has a template - if it doesnt no need to test it
const filterSteps = step => {
  const stepInstance = new step({ journey: {} });
  const notMockStep = Object.values(config.paths).includes(step.path);
  return stepInstance.middleware.includes(resolveTemplate) && notMockStep;
};

// ensure step has parse function - if it does then test POST requests
const stepIsPostable = step => {
  const stepInstance = new step({ journey: {} });
  return typeof stepInstance.parse === 'function';
};

// Ignored Errors
const excludedErrors = [ 'WCAG2AA.Principle1.Guideline1_3.1_3_1.F92,ARIA4' ];
const filteredErrors = r => {
  return !excludedErrors.includes(r.code);
};

// Ignored Warnings
const excludedWarnings = [ 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H48.2' ];
const filteredWarnings = r => {
  return !excludedWarnings.includes(r.code);
};

// set up step with valid idam creds
const userDetails = {
  id: 'idamUserId',
  email: 'user@email.com'
};

const getAgent = step => {
  return custom(step)
    .withCookie('mockIdamUserDetails', JSON.stringify(userDetails))
    .withGlobal('feedbackLink', 'https://github.com/hmcts/one-per-page/issues/new')
    .withSession({ case: { data: {} } })
    .asServer();
};

const validateAccessibility = (step, method) => {
  return new Promise((resolve, reject) => {
    const agent = getAgent(step);
    a11y(agent.get(step.path).url, method)
      .then(results => {
        const errors = results
          .filter(result => result.type === 'error')
          .filter(error => {
            if (step.ignorePa11yErrors) {
              return !step.ignorePa11yErrors.includes(error.code);
            }
            return true;
          });
        const warnings = results
          .filter(result => result.type === 'warning')
          .filter(warning => {
            if (step.ignorePa11yWarnings) {
              return !step.ignorePa11yWarnings.includes(warning.code);
            }
            return true;
          });
        return resolve({ errors, warnings });
      })
      .catch(reject);
  });
};

steps
  .filter(filterSteps)
  .forEach(step => {
    describe(`Validate HTML accessibility for the page ${step.name}`, () => {
      let errors = [];
      let warnings = [];

      describe('GET Requests', () => {
        before(() => {
          return validateAccessibility(step, 'GET')
            .then(results => {
              errors = results.errors
                .filter(filteredErrors);
              warnings = results.warnings
                .filter(filteredWarnings);
            })
            .catch(error => {
              expect(error).to.eql(false, `Error when validating HTML accessibility: ${error}`);
            });
        });

        it('should not generate any errors', () => {
          expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
        });

        it('should not generate any warnings', () => {
          expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
        });
      });

      if (stepIsPostable(step)) {
        describe('POST Requests', () => {
          before(() => {
            return validateAccessibility(step, 'POST')
              .then(results => {
                errors = results.errors
                  .filter(filteredErrors);
                warnings = results.warnings
                  .filter(filteredWarnings);
              })
              .catch(error => {
                expect(error).to.eql(false, `Error when validating HTML accessibility: ${error}`);
              });
          });

          it('should not generate any errors', () => {
            expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
          });

          it('should not generate any warnings', () => {
            expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
          });
        });
      }
    });
  });