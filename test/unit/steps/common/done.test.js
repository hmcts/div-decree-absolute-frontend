const modulePath = 'steps/done/Done.step';

const Done = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect and idam.logout middleware', () => {
    return middleware.hasMiddleware(Done, [idam.protect(), idam.logout()]);
  });

  it('renders the content', () => {
    const session = { case: { data: {} } };
    const ignoreContent = [
      'continue',
      'serviceName',
      'backLink',
      'signOut',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'signIn'
    ];
    return content(Done, session, { ignoreContent });
  });

  describe('values', () => {
    it('displays reference number', () => {
      const session = {
        case: {
          data: {
            caseReference: 'LV17D80101'
          }
        }
      };
      return content(
        Done,
        session,
        {
          specificValues: [ session.case.data.caseReference ]
        }
      );
    });

    it('displays petitioner email', () => {
      const session = { case: { data: { petitionerEmail: 'petitioner@email.com' } } };
      return content(
        Done,
        session,
        {
          specificValues: [session.case.data.petitionerEmail]
        }
      );
    });
  });
});
