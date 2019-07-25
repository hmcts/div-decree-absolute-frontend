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
        response.data.decreeNisiGrantedDate = '2019-06-10T00:00:00.000Z';
        req.idam.userDetails.email = 'email@email.com';
        return expect(caseOrchestrationHelper.validateResponse(req, response))
          .to.be.rejectedWith(caseOrchestrationHelper.redirectToDecreeNisiError);
      });

      it('if the case does not have decreeNisiGrantedDate set (i.e old paper-based case) ', () => {
        response.state = 'AwaitingDecreeAbsolute';
        response.data.courts = config.ccd.courts[0];
        response.data.petitionerEmail = 'email@email.com';
        req.idam.userDetails.email = 'email@email.com';
        return expect(caseOrchestrationHelper.validateResponse(req, response))
          .to.be.rejectedWith(caseOrchestrationHelper.redirectToDecreeNisiError);
      });
    });

    it('resolves if state is valid and case is in proper DA state', () => {
      response.state = 'AwaitingDecreeAbsolute';
      response.data.decreeNisiGrantedDate = '2019-06-10T00:00:00.000Z';
      response.data.courts = config.ccd.courts[0];
      response.data.petitionerEmail = 'email@email.com';
      req.idam.userDetails.email = 'email@email.com';
      return expect(caseOrchestrationHelper.validateResponse(req, response))
        .to.eventually.equal(response);
    });

    it('resolves if user is respondent and case state is DivorceGranted', () => {
      response.state = 'DivorceGranted';
      response.data.decreeNisiGrantedDate = '2019-06-10T00:00:00.000Z';
      response.data.courts = config.ccd.courts[0];
      response.data.respEmailAddress = 'email@email.com';
      req.idam.userDetails.email = 'email@email.com';
      return expect(caseOrchestrationHelper.validateResponse(req, response))
        .to.eventually.equal(response);
    });
  });

  describe('#handleErrorCodes', () => {
    const error = {};
    beforeEach(() => {
      sinon.stub(redirectToFrontendHelper, 'redirectToDN');
      sinon.stub(redirectToFrontendHelper, 'redirectToRFE');
    });

    afterEach(() => {
      redirectToFrontendHelper.redirectToDN.restore();
      redirectToFrontendHelper.redirectToRFE.restore();
    });

    it('redirect to Decree Nisi frontend if error is REDIRECT_TO_DECREE_NISI_FE', () => {
      caseOrchestrationHelper.handleErrorCodes(caseOrchestrationHelper.redirectToDecreeNisiError);
      expect(redirectToFrontendHelper.redirectToDN.calledOnce).to.eql(true);
    });

    it('redirect to Respondent FE if error is REDIRECT_TO_RESPONDENT_FE', () => {
    // eslint-disable-next-line max-len
      caseOrchestrationHelper.handleErrorCodes(caseOrchestrationHelper.redirectToRespondentFrontendError);
      expect(redirectToFrontendHelper.redirectToRFE.calledOnce).to.eql(true);
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
