const config = require('config');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

const authTokenString = '__auth-token';

const modulePath = 'helpers/redirectToFrontendHelper';

const { redirectToDN } = require(modulePath);

describe(modulePath, () => {
  let req = {};
  let res = {};

  beforeEach(() => {
    req = {
      cookies: {
        '__auth-token': 'someValue'
      }
    };

    res = {
      redirect: sinon.stub()
    };
  });
  it('should redirect to DN on call', () => {
    const dnFrontend = config.services.dnFrontend;
    const landingUrl = `${dnFrontend.url}${dnFrontend.landing}`;
    const expectedUrl = `${landingUrl}?${authTokenString}=someValue`;

    redirectToDN(req, res);

    expect(res.redirect.calledWith(expectedUrl)).to.equal(true);
  });
});
