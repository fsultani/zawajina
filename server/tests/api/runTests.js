const loginTests = require('./login');
const signupTests = require('./signup');
const signupProfileTests = require('./signupProfile');

/*
  node server/tests/api/runTests.js
*/

(async () => {
  const loginTestsResponse = await loginTests();
  const signupTestsResponse = await signupTests(loginTestsResponse);
  await signupProfileTests(signupTestsResponse);
})();
