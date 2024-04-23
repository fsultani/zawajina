require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const readline = require('readline');
const { baseHeaders, phoneNumber, shortPhoneNumber, invalidCharacters, webLinks } = require('./data');
const { socialMediaAccounts, socialMediaTags } = require('../utils');

/*
  node server/tests/api/signupProfile.js --runAlone
*/

const originalData = mockData => [
  {
    birthMonth: '10',
    birthDay: '14',
    birthYear: '1983',
    gender: 'male',
    city: 'Orange',
    state: 'CA',
    country: 'United States',
    ethnicity: [
      'Afghan'
    ],
    countryRaisedIn: 'United States',
    languages: [
      'English'
    ],
    religiousConviction: 'Sunni',
    religiousValues: 'Conservative',
    maritalStatus: 'Never Married',
    education: 'Bachelor\'s degree',
    profession: 'Engineer',
    hasChildren: 'No',
    wantsChildren: 'No',
    height: 181,
    canRelocate: 'No',
    diet: 'Halal when possible',
    smokes: 'No',
    hobbies: [
      'Coding'
    ],
    aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    aboutMyMatch: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    ...mockData,
  },
];

const tests = [
  ...originalData({
    testType: 'birthMonth',
    birthMonth: '13',
    birthDay: '14',
    birthYear: '1983',
  }),
  ...originalData({
    testType: 'birthMonth',
    birthMonth: '10',
    birthDay: '32',
    birthYear: '1983',
  }),
  ...originalData({
    testType: 'birthMonth',
    birthMonth: '10',
    birthDay: '14',
    birthYear: '2015',
  }),
  ...originalData({
    testType: 'gender',
    gender: 'm',
  }),
  ...originalData({
    testType: 'gender',
    gender: 'f',
  }),
  ...originalData({
    testType: 'gender',
    gender: 'binary',
  }),
  ...originalData({
    testType: 'city',
    city: 'Orange',
    state: 'AZ',
    country: 'United States',
  }),
  ...originalData({
    testType: 'city',
    city: 'Dubai',
    state: null,
    country: 'United States',
  }),
  ...originalData({
    testType: 'city',
    city: 'Makkah',
    state: null,
    country: 'UAE',
  }),
  ...originalData({
    testType: 'ethnicity',
    ethnicity: ['Afghani'],
  }),
  ...originalData({
    testType: 'ethnicity',
    ethnicity: ['Afghan', 'Pak'],
  }),
  ...originalData({
    testType: 'ethnicity',
    ethnicity: ['Pakistani', 'Al Arabiya'],
  }),
  ...originalData({
    testType: 'countryRaisedIn',
    countryRaisedIn: 'United States of America',
  }),
  ...originalData({
    testType: 'countryRaisedIn',
    countryRaisedIn: 'US',
  }),
  ...originalData({
    testType: 'countryRaisedIn',
    countryRaisedIn: 'US of A',
  }),
  ...originalData({
    testType: 'languages',
    languages: ['Eng']
  }),
  ...originalData({
    testType: 'languages',
    languages: ['English', 'Urdo'],
  }),
  ...originalData({
    testType: 'languages',
    languages: ['Urdu', 'Arabiya'],
  }),
  ...originalData({
    testType: 'religiousConviction',
    religiousConviction: 'Sunnah',
  }),
  ...originalData({
    testType: 'religiousConviction',
    religiousConviction: 'Shiaa',
  }),
  ...originalData({
    testType: 'religiousConviction',
    religiousConviction: 'Just Muslim khalas',
  }),
  ...originalData({
    testType: 'religiousValues',
    religiousValues: 'Conservative/Moderate',
  }),
  ...originalData({
    testType: 'religiousValues',
    religiousValues: 'Moderate Lib',
  }),
  ...originalData({
    testType: 'religiousValues',
    religiousValues: 'Lib',
  }),
  ...originalData({
    testType: 'maritalStatus',
    maritalStatus: 'Never married',
  }),
  ...originalData({
    testType: 'maritalStatus',
    maritalStatus: 'Separated',
  }),
  ...originalData({
    testType: 'maritalStatus',
    maritalStatus: 'Not married'
  }),
  ...originalData({
    testType: 'education',
    education: 'Bachelors degree',
  }),
  ...originalData({
    testType: 'education',
    education: 'Masters degree',
  }),
  ...originalData({
    testType: 'education',
    education: 'Doctoral Degree',
  }),
  ...originalData({
    testType: 'profession',
    profession: 'Software Engineer',
  }),
  ...originalData({
    testType: 'profession',
    profession: 'Professor',
  }),
  ...originalData({
    testType: 'profession',
    profession: 'Qari',
  }),
  ...originalData({
    testType: 'hasChildren',
    hasChildren: 'Yup',
  }),
  ...originalData({
    testType: 'hasChildren',
    hasChildren: 'Nope',
  }),
  ...originalData({
    testType: 'hasChildren',
    hasChildren: 'Idk',
  }),
  ...originalData({
    testType: 'wantsChildren',
    wantsChildren: 'Yup',
  }),
  ...originalData({
    testType: 'wantsChildren',
    wantsChildren: 'Nope',
  }),
  ...originalData({
    testType: 'wantsChildren',
    wantsChildren: 'Idk',
  }),
  ...originalData({
    testType: 'height',
    height: 140,
  }),
  ...originalData({
    testType: 'height',
    height: 200,
  }),
  ...originalData({
    testType: 'height',
    height: 180.5,
  }),
  ...originalData({
    testType: 'canRelocate',
    canRelocate: 'Yup',
  }),
  ...originalData({
    testType: 'canRelocate',
    canRelocate: 'Nope',
  }),
  ...originalData({
    testType: 'canRelocate',
    canRelocate: 'Idk',
  }),
  ...originalData({
    testType: 'diet',
    diet: 'Halal',
  }),
  ...originalData({
    testType: 'diet',
    diet: 'Meat',
  }),
  ...originalData({
    testType: 'diet',
    diet: 'Non haraam',
  }),
  ...originalData({
    testType: 'smokes',
    smokes: 'Yup',
  }),
  ...originalData({
    testType: 'smokes',
    smokes: 'Nope',
  }),
  ...originalData({
    testType: 'smokes',
    smokes: 'Idk',
  }),
  ...originalData({
    testType: 'hobbies',
    hobbies: ['Programming'],
  }),
  ...originalData({
    testType: 'hobbies',
    hobbies: ['Coding', 'Planew'],
  }),
  ...originalData({
    testType: 'hobbies',
    hobbies: ['Driving', 'Lectures'],
  }),
];

const aboutMeTests = [
  ...socialMediaAccounts,
  ...socialMediaTags,
  ...phoneNumber,
  ...shortPhoneNumber,
  ...invalidCharacters,
  ...webLinks,
].map(item => [
  ...originalData({
    testType: 'aboutMe',
    aboutMe: `${item} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  }),
]).flat()

const aboutMyMatchTests = [
  ...socialMediaAccounts,
  ...socialMediaTags,
  ...phoneNumber,
  ...shortPhoneNumber,
  ...invalidCharacters,
  ...webLinks,
].map(item => [
  ...originalData({
    testType: 'aboutMyMatch',
    aboutMyMatch: `${item} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  }),
]).flat();

const allTests = [
  ...tests,
  ...aboutMeTests,
  ...aboutMyMatchTests,
];

const signupProfileTests = async (initialCount = 0) => {
  const testResults = [];

  for (const mockData of allTests) {
    try {
      const signupFormData = new FormData();
      const signupStepOneResponse = await axios.post('http://localhost:3000/api/register/personal-info', {
        nameValue: "Farid",
        email: "faridsultani.ba@gmail.com",
        password: "asdfasdf"
      })

      const { authUserId } = signupStepOneResponse.data;

      signupFormData.append('userInfo', JSON.stringify(mockData));
      signupFormData.append('authUserId', authUserId);

      await axios.post('http://localhost:3000/api/register/profile-details', signupFormData, {
        headers: {
          ...baseHeaders,
          ...signupFormData.getHeaders(),
        },
      })

      testResults.push({
        ...mockData,
        result: 'fail',
      })
    } catch (error) {
      testResults.push({
        ...mockData,
        result: 'pass',
      })
    }

    const index = allTests.indexOf(mockData);
    readline.cursorTo(process.stdout, 0, initialCount + 1);
    readline.clearScreenDown(process.stdout);

    let percent = Math.round((index + 1) / allTests.length * 100);
    console.log(`${index + 1} of ${allTests.length} signupProfile tests run - ${percent}% complete`);
    console.log(`=`.repeat(percent));
    console.log(`-`.repeat(100));
  }

  readline.cursorTo(process.stdout, 0, initialCount + 1);
  readline.clearScreenDown(process.stdout);

  const testsPass = testResults.every(res => res.result === 'pass');
  if (testsPass) {
    console.log(`***** All ${testResults.length} signupProfile tests passed *****`)
  } else {
    const numberOfTestsPassed = testResults.filter(res => res.result === 'pass');
    console.log(`***** ${numberOfTestsPassed.length} signupProfile ${numberOfTestsPassed.length === 1 ? 'test' : 'tests'} passed *****`)

    const numberOfTestsFailed = testResults.filter(res => res.result === 'fail');
    console.log(`***** ${numberOfTestsFailed.length} signupProfile ${numberOfTestsFailed.length === 1 ? 'test' : 'tests'} failed *****`)

    numberOfTestsFailed.map(test => {
      const failedTest = Object.entries(test).filter(item => item[0] === test.testType)[0];
      console.log(failedTest);
    })
  }

  console.log(``);
};

const filePath = process.argv.slice(1)[0].split('/')
const fileName = filePath[filePath.length - 1];

const processArgv = process.argv.slice(2);
const firstArgument = processArgv[0]?.split('=')[0];

if (fileName === 'signupProfile.js') {
  firstArgument === '--runAlone' ? signupProfileTests() : console.log(`Missing arguments: --runAlone`);
}


module.exports = signupProfileTests;
