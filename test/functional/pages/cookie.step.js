const CookiesPolicy = require('steps/cookies-policy/CookiesPolicy.step');
const CookiesPolicyContent = require('steps/cookies-policy/CookiesPolicy.content');

function testCookiesPolicyPage(language = 'en') {
  const I = this;

  I.amOnLoadedPage(CookiesPolicy.path);

  I.see(CookiesPolicyContent[language].title);
}

module.exports = { testCookiesPolicyPage };
