/*
node server/queries/apiCalls/createUserAccounts.js --gender=female --numberOfPhotos=0 --numberOfUsers=5
*/

require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');

const axios = require('axios');
const FormData = require('form-data');
const locations = require('../../data/world-cities');
const unitedStates = locations.default.getAllUnitedStates();

require('../../config/cloudinary');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const femaleNames = require('../../data/female-names');
const maleNames = require('../../data/male-names');
const birthMonths = require('../../data/birthMonths');
const professionsList = require('../../data/professionsList');
const heights = require('../../data/heights');

const worldCities = require('../../data/world-cities');
const ethnicities = require('../../data/ethnicities');
const languagesList = require('../../data/languages');
const hobbiesList = require('../../data/hobbies');

const processArgv = process.argv.slice(2);

if (!processArgv[0] || !processArgv[1] || !processArgv[2]) {
  console.log(`Missing arguments: --gender=female --numberOfPhotos=1 --numberOfUsers=5`);
  process.exit(1);
}

const firstArgument = processArgv[0]?.split('=')[0];
const secondArgument = processArgv[1]?.split('=')[0];
const thirdArgument = processArgv[2]?.split('=')[0];

if (
  !(
    (firstArgument === '--gender' || firstArgument === '--numberOfUsers' || firstArgument === '--numberOfPhotos') &&
    (secondArgument === '--gender' || secondArgument === '--numberOfUsers' || secondArgument === '--numberOfPhotos') &&
    (thirdArgument === '--gender' || thirdArgument === '--numberOfUsers' || thirdArgument === '--numberOfPhotos')
  )
) {
  console.log(`Missing arguments: --gender=female --numberOfPhotos=1 --numberOfUsers=5`);
  process.exit(1);
}

/* ************************* */

const genders = ['male', 'female'];

let gender;
if (firstArgument === '--gender') {
  gender = processArgv[0].split('=')[1];
}

if (secondArgument === '--gender') {
  gender = processArgv[1].split('=')[1];
}

if (thirdArgument === '--gender') {
  gender = processArgv[2].split('=')[1];
}

if (genders.indexOf(gender) === -1) {
  console.log(`Gender must be 'male' or 'female'`);
  process.exit(1);
}

/* ************************* */

let numberOfUsers;
if (firstArgument === '--numberOfUsers') {
  numberOfUsers = Number(processArgv[0].split('=')[1]);
}

if (secondArgument === '--numberOfUsers') {
  numberOfUsers = Number(processArgv[1].split('=')[1]);
}

if (thirdArgument === '--numberOfUsers') {
  numberOfUsers = Number(processArgv[2].split('=')[1]);
}

if (!numberOfUsers) {
  console.log(`Enter a number for numberOfUsers`);
  process.exit(1);
}

/* ************************* */

let numberOfPhotos;
if (firstArgument === '--numberOfPhotos') {
  numberOfPhotos = Number(processArgv[0].split('=')[1]);
}

if (secondArgument === '--numberOfPhotos') {
  numberOfPhotos = Number(processArgv[1].split('=')[1]);
}

if (thirdArgument === '--numberOfPhotos') {
  numberOfPhotos = Number(processArgv[2].split('=')[1]);
}

if (numberOfPhotos > 3) {
  console.log('numberOfPhotos must be less than 4');
  process.exit(1);
}

const calculateDob = () => {
  const now = new Date();

  const birthMonth = birthMonths[Math.floor(Math.random() * birthMonths.length)];
  const birthDay = Math.floor(Math.random() * 31).toString();
  const birthYear = (1999 - Math.floor(Math.random() * 30)).toString();

  const fullDob = `${birthMonth}/${birthDay}/${birthYear}`;
  const isValidDob = Date.parse(fullDob);
  const isFutureDate = (now - isValidDob) < 0;
  if (!isValidDob || isFutureDate) return calculateDob();

  return {
    birthMonth,
    birthDay,
    birthYear,
  }
}

let userName;
const createAccount = async (newEmail = false) => {
  try {
    const signupFormData = new FormData();

    if (!newEmail) {
      userName = gender === 'female' ?
        femaleNames[Math.floor(Math.random() * femaleNames.length)] :
        maleNames[Math.floor(Math.random() * maleNames.length)];
    }

    const name = userName.toLowerCase();

    const nameChoice = {
      name: userName,
      email: `${name}@me.com`,
      gender,
    };

    if (newEmail) {
      const randomNumber = Math.floor(Math.random() * 90000) + 10000;
      nameChoice.email = `${name + randomNumber}@me.com`;
    }

    const signupStepOneResponse = await axios.post('http://localhost:3000/api/register/personal-info', {
      nameValue: nameChoice.name,
      email: nameChoice.email,
      password: 'asdfasdf',
    })

    const { userId } = signupStepOneResponse.data;

    await axios.put(`http://localhost:3000/api/register/verify-email`, {
      token: signupStepOneResponse.data.emailVerificationToken,
    },
    {
      headers: {
        Cookie: `my_match_userId=${userId}`
      }
    })

    const { birthMonth, birthDay, birthYear } = calculateDob();

    const allLocations = worldCities.default.getAllCities();
    const location = allLocations.filter(location => {
      // return location.country === 'United States';
      // return location.country === 'Saudi Arabia';
      // return location.country === 'United Arab Emirates';
      // return location.country === 'Saudi Arabia' || location.country === 'United Arab Emirates';
      return location.country === 'United States' || location.country === 'Saudi Arabia' || location.country === 'United Arab Emirates';
    });
    const selectLocation = location[Math.floor(Math.random() * location.length)];

    const allEthnicities = ethnicities.default.getAllEthnicities();
    const randomEthnicity = Math.floor(Math.random() * allEthnicities.length);
    const ethnicity = allEthnicities[randomEthnicity];

    const allLanguages = languagesList.default.getAllLanguages();
    const languages = allLanguages[Math.floor(Math.random() * allLanguages.length)];

    const allReligiousConvictions = ['Sunni', 'Shia', 'Just Muslim'];
    const religiousConviction = allReligiousConvictions[Math.floor(Math.random() * allReligiousConvictions.length)];

    const allReligiousValues = ['Conservative', 'Moderate', 'Liberal'];
    const religiousValues = allReligiousValues[Math.floor(Math.random() * allReligiousValues.length)];

    const allMaritalStatuses = ['Never Married', 'Divorced', 'Widowed'];
    const maritalStatus = allMaritalStatuses[Math.floor(Math.random() * allMaritalStatuses.length)];

    const allEducationLevels = ['High School', `Bachelor's degree`, `Master's degree`, 'Doctoral degree']
    const education = allEducationLevels[Math.floor(Math.random() * allEducationLevels.length)];

    const profession = professionsList[Math.floor(Math.random() * professionsList.length)];

    const yesNoOptions = ['Yes', 'No'];
    const yesNoMaybeOptions = ['Yes', 'No', 'Maybe'];

    const height = heights[Math.floor(Math.random() * heights.length)];

    const allDiets = ['Halal only', 'Halal when possible', 'Eat anything', 'Eat anything except pork', 'Vegetarian'];
    const diet = allDiets[Math.floor(Math.random() * allDiets.length)];

    const prayerLevels = ['Rarely', 'Sometimes', 'Always'];
    const prayerLevel = prayerLevels[Math.floor(Math.random() * prayerLevels.length)];

    const allHobbies = hobbiesList.default.getAllHobbies();
    const hobbies = [allHobbies[Math.floor(Math.random() * allHobbies.length)]];

    const aboutUserText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent semper. Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus.`

    signupFormData.append('userInfo', `{
        "birthMonth": "${birthMonth}",
        "birthDay": "${birthDay}",
        "birthYear": "${birthYear}",
        "gender": "${gender}",
        "city": "${selectLocation.city}",
        "state": ${selectLocation.state ? `"${selectLocation.state}"` : null},
        "country": "${selectLocation.country}",
        "ethnicity": [
          "${ethnicity}"
        ],
        "countryRaisedIn": "${selectLocation.country}",
        "languages": [
          "${languages}"
        ],
        "religiousConviction": "${religiousConviction}",
        "religiousValues": "${religiousValues}",
        "maritalStatus": "${maritalStatus}",
        "education": "${education}",
        "profession": "${profession}",
        "hasChildren": "hasChildren${yesNoOptions[Math.floor(Math.random() * 2)]}",
        "hijab": ${gender === 'female' ? `"hijab${yesNoOptions[Math.floor(Math.random() * 2)]}" ` : null},
        "wantsChildren": "wantsChildren${yesNoMaybeOptions[Math.floor(Math.random() * 2)]}",
        "height": ${height},
        "canRelocate": "canRelocate${yesNoOptions[Math.floor(Math.random() * 2)]}",
        "diet": "${diet}",
        "smokes": "smokes${yesNoOptions[Math.floor(Math.random() * 2)]}",
        "prayerLevel": "${prayerLevel}",
        "hobbies": [
          "${hobbies}"
        ],
        "aboutMe": "${aboutUserText}",
        "aboutMyMatch": "${aboutUserText}",
        "userIPAddress": "98.148.238.157"
      }`);

    const photos = [
      '/Users/farid/Downloads/temp/IMG_0041.jpg',
      '/Users/farid/Downloads/temp/IMG_0047.jpg',
      '/Users/farid/Downloads/temp/IMG_0048.jpg',
      '/Users/farid/Downloads/temp/IMG_0051.jpg',
      '/Users/farid/Downloads/temp/IMG_0053.jpg',
      '/Users/farid/Downloads/temp/IMG_0063.jpg',
    ];

    for (let index = 0; index < numberOfPhotos; index++) {
      signupFormData.append(`image-${index}`, fs.createReadStream(photos[index]));
    }

    signupFormData.append('userId', userId);

    await axios.post('http://localhost:3000/api/register/profile-details', signupFormData, {
      /* For testing only. Default file size limit for axis post requests is 10MB. */
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,la;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8',
        'DNT': '1',
        'Origin': 'http://localhost:3000',
        'Pragma': 'no-cache',
        'Referer': 'http://localhost:3000/signup',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'userIPAddress': '98.148.238.157',
        ...signupFormData.getHeaders(),
      },
    })

    const { data } = await axios.post('http://localhost:3000/api/auth-session/login', {
      email: nameChoice.email,
      password: 'asdfasdf',
    })
    const token = data.cookie.value;

    const numberOfLocations = Math.floor(Math.random() * 5) + 1;
    const searchOptionsLocations = [...Array(numberOfLocations)].map((_, i) => {
      const getRandomLocation = allLocations.filter(location => {
        return location.country === 'United States';
        // return location.country === 'Saudi Arabia';
        // return location.country === 'United Arab Emirates';
        // return location.country === 'Saudi Arabia' || location.country === 'United Arab Emirates';
        // return location.country === 'United States' || location.country === 'Saudi Arabia' || location.country === 'United Arab Emirates';
      });

      const selectRandomLocation = getRandomLocation[Math.floor(Math.random() * getRandomLocation.length)];

      const city = selectRandomLocation.country === 'United States' ? 'null' : selectRandomLocation.city;
      const state = selectRandomLocation.country === 'United States' ? unitedStates.find(item => item.abbreviation === selectRandomLocation.state).name : 'null';
      const country = selectRandomLocation.country;

      return {
        city,
        state,
        country,
      }
    });

    const searchOptions = {
      // "locations": searchOptionsLocations,
      "locations": [],
      "languages": [],
      "profession": [],
      "hobbies": [],
      "maritalStatus": [],
      "religiousConviction": [],
      "religiousValues": [],
      "education": [],
      "hasChildren": "hasChildrenDoesNotMatter",
      "wantsChildren": "wantsChildrenDoesNotMatter",
      "hijab": "hijabDoesNotMatter",
      "diet": [],
      "smokes": "smokesDoesNotMatter",
      "ethnicity": [],
      "age": {
        "minAgeValue": "18",
        "maxAgeValue": "60"
      },
      "height": {
        "minHeightValue": "147",
        "maxHeightValue": "196"
      },
      "prayerLevel": [],
      "sortResults": "lastActive",
      "showPhotosOnly": false
    };

    await axios.put('http://localhost:3000/search/api', searchOptions, {
      headers: {
        Cookie: `my_match_authToken=${token}`
      }
    })
  } catch (error) {
    const errorResponse = error.response?.data ?? error.message;
    console.log(`errorResponse - server/queries/apiCalls/createUserAccounts.js:351\n`, errorResponse);
    if (errorResponse.message === 'Account already exists' || errorResponse.message === 'Invalid dob-month') {
      await createAccount(true);
    } else {
      process.exit(1);
    }
  }
}

(async () => {
  for (let index = 0; index < numberOfUsers; index++) {
    await createAccount();
    console.log(`${index + 1}/${numberOfUsers} accounts created`);
  }

  await client.close();
  console.log(`Close client`);
})();
