const moduleName = 'helpers/caseOrchestrationHelper';

const rewire = require('rewire');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const { Question } = require('@hmcts/one-per-page/steps');
const { form, date, convert, text } = require('@hmcts/one-per-page/forms');
const moment = require('moment');
const caseOrchestrationHelper = require(moduleName);
const config = require('config');
const redirectToFrontendHelper = require('helpers/redirectToFrontendHelper');
const { IM_A_TEAPOT } = require('http-status-codes');
const idam = require('services/idam');

describe(moduleName, () => {
  describe('#formatSessionForSubmit', () => {
    const caseOrchestrationHelperRewired = rewire(moduleName);

    class Step extends Question {
      get form() {
        return form({
          date: convert(
            d => moment(`${d.year}-${d.month}-${d.day}`, 'YYYY-MM-DD').endOf('day'),
            date
          ),
          text,
          unAnsweredField: text
        });
      }
    }

    class OtherStep extends Question {
      get form() {
        return form({
          shouldNotApear: text
        });
      }
    }

    const req = {
      journey: {
        steps: { [Step.name]: Step, [OtherStep.name]: OtherStep }
      },
      session: {
        Step: {
          date: { year: '2010', month: '10', day: '10' },
          text: 'foo'
        }
      }
    };
    const res = {};

    let body = {};
    before(() => {
      const stepInstance = new Step(req, res);
      stepInstance.retrieve();

      req.journey.instance = sinon.stub().returns(stepInstance);

      const map = {
        'Step.date': 'date',
        'Step.text': 'text',
        'Step.unAnsweredField': 'unAnsweredField',
        'OtherStep.unAnsweredStepField': 'unAnsweredStepField'
      };
      caseOrchestrationHelperRewired.__set__('sessionToCosMapping', map);

      body = caseOrchestrationHelperRewired.formatSessionForSubmit(req);
    });

    it('unAnsweredFields should be set to null', () => {
      expect(body).to.have.property('unAnsweredField');
      expect(body.unAnsweredField).to.eql(null);
    });

    it('unanswered steps fields should be set to null', () => {
      expect(body).to.have.property('unAnsweredStepField');
      expect(body.unAnsweredStepField).to.eql(null);
    });

    it('returns correct value for date', () => {
      expect(JSON.stringify(body)).to.include('2010-10-10');
    });

    it('returns correct value for text', () => {
      expect(body).to.include({ text: 'foo' });
    });
  });

  describe('#validateResponse', () => {
    let req = {};
    let response = {};

    beforeEach(() => {
      req = {
        idam: {
          userDetails: {}
        }
      };
      response = {
        data: {}
      };
    });

    context('rejects with redirectToDecreeNisiError', () => {
      beforeEach(() => {
        response.state = 'aValidState';
        response.data.courts = config.ccd.courts[0];
      });

      it('if the state is in blacklist', () => {
        response.data.petitionerEmail = 'email@email.com';
        req.idam.userDetails.email = 'email@email.com';
        return expect(caseOrchestrationHelper.validateResponse(req, response))
          .to.be.rejectedWith(caseOrchestrationHelper.redirectToDecreeNisiError);
      });
    });

    it('resolves if state is valid and case is in proper DA state', () => {
      response.state = 'AwaitingDecreeAbsolute';
      response.data.courts = config.ccd.courts[0];
      response.data.petitionerEmail = 'email@email.com';
      req.idam.userDetails.email = 'email@email.com';
      return expect(caseOrchestrationHelper.validateResponse(req, response))
        .to.eventually.equal(response);
    });
  });

  describe('#handleErrorCodes', () => {
    const error = {};
    beforeEach(() => {
      sinon.stub(redirectToFrontendHelper, 'redirectToDN');
    });

    afterEach(() => {
      redirectToFrontendHelper.redirectToDN.restore();
    });

    // eslint-disable-next-line max-len
    it('redirect to decree nisi frontend & logs out out of IDAM if error is REDIRECT_TO_DECREE_NISI_FE'
      , () => {
        const idamLogoutMiddleware = sinon.stub().callsArg(2);
        sinon.stub(idam, 'logout').returns(idamLogoutMiddleware);
        caseOrchestrationHelper.handleErrorCodes(caseOrchestrationHelper.redirectToDecreeNisiError);
        expect(redirectToFrontendHelper.redirectToDN.calledOnce).to.eql(true);
        expect(idam.logout.calledOnce).to.eql(true);
        idam.logout.restore();
      });

    it('calls next with error if error not recognised', () => {
      const next = sinon.stub();
      error.statusCode = IM_A_TEAPOT;
      caseOrchestrationHelper.handleErrorCodes(error, {}, {}, next);
      expect(next.calledOnce).to.eql(true);
      expect(next.calledWith(error)).to.eql(true);
    });
  });
});
