Feature('Happy path', { retries: 1 });

Scenario('View example page', I => {
  I.seeExamplePage('/index');
});
