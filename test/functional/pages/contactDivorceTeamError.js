const ContactDivorceTeamError = require(
  'steps/contact-divorce-team-error/ContactDivorceTeamError.step'
);
const ContactDivorceTeamErrorContent = require(
  'steps/contact-divorce-team-error/ContactDivorceTeamError.content'
);

function testContactDivorceTeamError(language = 'en') {
  const I = this;

  I.amOnLoadedPage(ContactDivorceTeamError.path);

  I.see(ContactDivorceTeamErrorContent[language].title);
}

module.exports = { testContactDivorceTeamError };
