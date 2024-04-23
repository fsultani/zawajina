require('dotenv').config();
const axios = require('axios');
const readline = require('readline');
const { baseHeaders } = require('./data');

/*
  node server/tests/api/login.js --runAlone
*/

const loginTests = async () => {
  const allTests = [
    {
      email: 'faridsultani.ba',
      password: 'asdfasdf',
      statusCode: 400,
    },
    {
      email: 'faridsultani.ba@',
      password: 'asdfasdf',
      statusCode: 400,
    },
    {
      email: `<img src="http://www.iioc.com/wp-content/uploads/2020/11/logo1.png" onload="alert('You got hacked.');" />`,
      password: 'asdfasdf',
      statusCode: 400,
    },
    {
      email: 'faridsultani.ba@gmail.com',
      password: '',
      statusCode: 400,
    },
    {
      email: 'faridsultani.ba@gmail.com',
      password: 'asdf',
      statusCode: 401,
    },
    {
      email: 'faridsultani.ba@gmail.com',
      password: 'asdfasdfasdfasdf',
      statusCode: 401,
    },
  ];

  const testResults = [];
  let finalCount = 0;

  for (const mockData of allTests) {
    const data = {
      email: mockData.email,
      password: mockData.password,
    }

    try {
      await axios.post('http://localhost:3000/api/auth-session/login', data, { baseHeaders })
      testResults.push({
        ...mockData,
        result: 'fail',
      })
    } catch (error) {
      testResults.push({
        ...mockData,
        result: error.response?.status === mockData.statusCode ? 'pass' : 'fail',
      })
    }

    const index = allTests.indexOf(mockData);
    readline.cursorTo(process.stdout, 0, 1);
    readline.clearScreenDown(process.stdout);

    let percent = Math.round((index + 1) / allTests.length * 100);
    console.log(`${index + 1} of ${allTests.length} login tests run - ${percent}% complete`);
    console.log(`=`.repeat(percent));
    console.log(`-`.repeat(100));
  }

  readline.cursorTo(process.stdout, 0, 1);
  readline.clearScreenDown(process.stdout);

  const testsPass = testResults.every(res => res.result === 'pass');
  if (testsPass) {
    console.log(`***** All ${testResults.length} login tests passed *****`);

    finalCount = 2;
  } else {
    const numberOfTestsPassed = testResults.filter(res => res.result === 'pass');
    console.log(`***** ${numberOfTestsPassed.length} login ${numberOfTestsPassed.length === 1 ? 'test' : 'tests'} passed *****`);

    const numberOfTestsFailed = testResults.filter(res => res.result === 'fail');
    console.log(`***** ${numberOfTestsFailed.length} login ${numberOfTestsFailed.length === 1 ? 'test' : 'tests'} failed *****`);

    numberOfTestsFailed.map(test => {
      console.log(test);
    })

    finalCount = (numberOfTestsFailed.length * 6) + 3;
  }

  return finalCount;
}

const filePath = process.argv.slice(1)[0].split('/')
const fileName = filePath[filePath.length - 1];

const processArgv = process.argv.slice(2);
const firstArgument = processArgv[0]?.split('=')[0];

if (fileName === 'login.js') {
  firstArgument === '--runAlone' ? loginTests() : console.log(`Missing arguments: --runAlone`);
}


module.exports = loginTests;
