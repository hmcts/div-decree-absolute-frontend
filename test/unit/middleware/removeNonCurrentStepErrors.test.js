const modulePath = 'middleware/removeNonCurrentStepErrors';
const removeNonCurrentStepErrors = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('should remove all fields for steps that are not the current step', () => {
    const res = sinon.stub();
    const next = sinon.stub();

    const req = {
      currentStep: {
        name: 'CurrentStep'
      },
      session: {
        temp: {
          CurrentStep: {},
          AnotherStep: {}
        }
      }
    };

    removeNonCurrentStepErrors(req, res, next);

    const expectedSessionTemp = { CurrentStep: {} };

    expect(req.session.temp).to.eql(expectedSessionTemp);
    expect(next.callCount).to.equal(1);
  });
});