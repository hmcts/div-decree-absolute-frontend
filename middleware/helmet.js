const config = require('config');
const helmet = require('helmet');

const setupHelmet = app => {
  // Protect against some well known web vulnerabilities
  // by setting HTTP headers appropriately.
  app.use(helmet());

  const webchatUrl = config.services.antennaWebchat.url;
  // Helmet content security policy (CSP) to allow only assets from same domain.
  app.use(helmet.contentSecurityPolicy({
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
  }));

  const maxAge = config.ssl.hpkp.maxAge;
  const sha256s = [ config.ssl.hpkp.sha256s, config.ssl.hpkp.sha256sBackup ];

  // Helmet HTTP public key pinning
  app.use(helmet.hpkp({ maxAge, sha256s }));

  // Helmet referrer policy
  app.use(helmet.referrerPolicy({ policy: 'origin' }));
};

module.exports = setupHelmet;
