const modulePath = 'middleware/helmet';

const helmet = require('helmet');
const proxyquire = require('proxyquire');
const config = require('config');
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

const hpkpStub = sinon.stub(helmet, 'hpkp');
const setupHelmet = proxyquire(modulePath, { hpkp: hpkpStub });

const app = {};
const webchatUrl = config.services.antennaWebchat.url;

describe(modulePath, () => {
  beforeEach(() => {
    app.use = sinon.stub();
  });

  it('adds core helmet to app middleware', () => {
    setupHelmet(app);
    expect(app.use.firstCall.args.toString()).to.eql(helmet().toString());
  });

  it('adds contentSecurityPolicy helmet to app middleware', () => {
    const contentSecurityPolicyStub = sinon.stub(helmet, 'contentSecurityPolicy');
    setupHelmet(app);

    sinon.assert.calledWith(contentSecurityPolicyStub, {
      directives: {
        defaultSrc: [
          '\'self\'',
          '\'data:\''
        ],
        fontSrc: ['\'self\' data:'],
        scriptSrc: [
          '\'self\'',
          '\'unsafe-inline\'',
          'www.google-analytics.com',
          'hmctspiwik.useconnect.co.uk',
          'www.googletagmanager.com',
          `https://${webchatUrl}`,
          `wss://${webchatUrl}`
        ],
        connectSrc: [
          '\'self\'',
          `https://${webchatUrl}`,
          `wss://${webchatUrl}`
        ],
        mediaSrc: [
          '\'self\'',
          `https://${webchatUrl}`,
          `wss://${webchatUrl}`
        ],
        frameSrc: [
          '\'none\'',
          `https://${webchatUrl}`,
          `wss://${webchatUrl}`
        ],
        imgSrc: [
          '\'self\'',
          'www.google-analytics.com',
          'hmctspiwik.useconnect.co.uk',
          `https://${webchatUrl}`,
          `wss://${webchatUrl}`
        ],
        styleSrc: [
          '\'self\'',
          '\'unsafe-inline\''
        ]
      }
    });

    contentSecurityPolicyStub.restore();
  });

  it('adds hpkp helmet to app middleware', () => {
    const maxAge = config.ssl.hpkp.maxAge;
    const sha256s = [ config.ssl.hpkp.sha256s, config.ssl.hpkp.sha256sBackup ];

    setupHelmet(app);

    sinon.assert.calledWith(hpkpStub, { maxAge, sha256s });
  });

  it('adds referrerPolicy helmet to app middleware', () => {
    const referrerPolicyStub = sinon.stub(helmet, 'referrerPolicy');
    setupHelmet(app);

    sinon.assert.calledWith(referrerPolicyStub, { policy: 'origin' });

    referrerPolicyStub.restore();
  });
});
