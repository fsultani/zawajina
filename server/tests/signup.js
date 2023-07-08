require('dotenv').config();
const axios = require('axios');
const readline = require('readline');
const { baseHeaders, phoneNumber, invalidCharacters, digit, webLinks } = require('./data');
const { socialMediaAccounts, socialMediaTags } = require('../utils');

/*
  node server/tests/signup.js --runAlone
*/

const headers = {
  ...baseHeaders,
  'Referer': 'http://localhost:3000/signup',
};

const allTests = [
  ...socialMediaAccounts,
  ...socialMediaTags,
  ...phoneNumber,
  ...invalidCharacters,
  ...digit,
  ...webLinks,
];

const signupTests = async (initialCount = 0) => {
  const testResults = [];
  let finalCount = 0;

  for (const mockData of allTests) {
    const data = {
      nameValue: `Farid ${mockData}`,
      email: 'faridsultani.ba@gmail.com',
      password: 'asdfasdf'
    }

    try {
      await axios.post('http://localhost:3000/api/register/personal-info', data, { headers })

      testResults.push({
        ...data,
        result: 'fail',
      })
    } catch (error) {
      testResults.push({
        ...data,
        result: 'pass',
      })
    }

    const index = allTests.indexOf(mockData);
    readline.cursorTo(process.stdout, 0, initialCount + 1);
    readline.clearScreenDown(process.stdout);

    let percent = Math.round((index + 1) / allTests.length * 100);
    console.log(`${index + 1} of ${allTests.length} signup tests run - ${percent}% complete`);
    console.log(`=`.repeat(percent));
    console.log(`-`.repeat(100));
  }

  readline.cursorTo(process.stdout, 0, initialCount + 1);
  readline.clearScreenDown(process.stdout);

  const testsPass = testResults.every(res => res.result === 'pass');
  if (testsPass) {
    console.log(`***** All ${testResults.length} signup tests passed *****`);

    finalCount = 2;
  } else {
    const numberOfTestsPassed = testResults.filter(res => res.result === 'pass');
    console.log(`***** ${numberOfTestsPassed.length} signup ${numberOfTestsPassed.length === 1 ? 'test' : 'tests'} passed *****`)

    const numberOfTestsFailed = testResults.filter(res => res.result === 'fail');
    console.log(`***** ${numberOfTestsFailed.length} signup ${numberOfTestsFailed.length === 1 ? 'test' : 'tests'} failed *****`)

    numberOfTestsFailed.map(test => {
      console.log(test);
    })

    finalCount = (numberOfTestsFailed.length * 6) + 3;
  }

  return initialCount + finalCount;
};

const filePath = process.argv.slice(1)[0].split('/')
const fileName = filePath[filePath.length - 1];

const processArgv = process.argv.slice(2);
const firstArgument = processArgv[0]?.split('=')[0];

if (fileName === 'signup.js') {
  firstArgument === '--runAlone' ? signupTests() : console.log(`Missing arguments: --runAlone`);
}


module.exports = signupTests;
