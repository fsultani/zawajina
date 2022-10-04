require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const femaleNames = require("../data/female-names");
const maleNames = require("../data/male-names");
const birthMonths = require('../data/birthMonths');
const professionsList = require('../data/professionsList');
const heights = require('../data/heights');

const worldCities = require('../data/world-cities');
const ethnicities = require("../data/ethnicities");
const languagesList = require('../data/languages');
const hobbiesList = require('../data/hobbies');

/*
  node server/queries/apiCalls/create-accounts.js --numberOfUsers=5 --gender=female
*/
const processArgv = process.argv.slice(2);

if (!processArgv[0] && !processArgv[1]) {
  console.log(`Missing arguments: --numberOfUsers=5 --gender=female`);
  process.exit(1);
}

if (!processArgv[0]) {
  console.log(`Missing argument: --numberOfUsers=5`);
  process.exit(1);
}

if (!processArgv[1]) {
  console.log(`Missing argument: --gender=female`);
  process.exit(1);
}

const numberOfUsers = Number(processArgv[0].split('=')[1]);
const gender = processArgv[1].split('=')[1];

if (!numberOfUsers) {
  console.log(`Enter a number for numberOfUsers`);
  process.exit(1);
}

const genders = ['male', 'female'];
if (genders.indexOf(gender) === -1) {
  console.log(`Gender must be 'male' or 'female'`);
  process.exit(1);
}

MongoClient.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, async (err, client) => {
  const db = client.db();

  for (let i = 0; i < numberOfUsers; i++) {
    const nameChoice = {
      name: gender === 'female' ?
        femaleNames[Math.floor(Math.random() * femaleNames.length)] :
        maleNames[Math.floor(Math.random() * maleNames.length)],
      gender,
    };

    const bcryptGenSalt = await bcrypt.genSalt(10);
    const bcryptHash = await bcrypt.hash('asdfasdf', bcryptGenSalt);
    const password = bcryptHash;

    const birthMonth = birthMonths[Math.floor(Math.random() * birthMonths.length)];
    const birthDay = Math.floor(Math.random() * 31).toString();
    const birthYear = (1999 - Math.floor(Math.random() * 30)).toString();

    const fullDob = `${birthMonth}/${birthDay}/${birthYear}`;
    const today = new Date();
    const dob = new Date(fullDob);
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
      age = age - 1;
    };

    const allLocations = worldCities.default.getAllCities();
    const selectLocation = allLocations[Math.floor(Math.random() * allLocations.length)]

    const geoCoordinates = worldCities.default.getGeoCoordinates();
    const locationGeoCoordinates = geoCoordinates.find(location => {
      if (location.state === selectLocation.state) {
        if (location.city === selectLocation.city) {
          return location;
        }
        return location;
      }
    });

    const longitude = locationGeoCoordinates?.coordinates.longitude ?? 39.857910;
    const latitude = locationGeoCoordinates?.coordinates.latitude ?? 21.389082;

    const geoLocationData = {
      "status": "success",
      "country": selectLocation.country,
      "countryCode": selectLocation.country,
      "region": selectLocation.state,
      "regionName": selectLocation.state,
      "city": selectLocation.city,
      "zip": "92869",
      "lat": latitude,
      "lon": longitude,
      "timezone": selectLocation.city,
      "isp": "Charter Communications",
      "org": "Spectrum",
      "as": "AS20001 Charter Communications Inc",
      "query": "98.148.238.157"
    }

    const allEthnicities = ethnicities.default.getAllEthnicities();
    const randomEthnicity = Math.floor(Math.random() * allEthnicities.length);
    const ethnicity = [allEthnicities[randomEthnicity]];

    const allLanguages = languagesList.default.getAllLanguages();
    const languages = [allLanguages[Math.floor(Math.random() * allLanguages.length)]];

    const allReligiousConvictions = ['Sunni', 'Shia', 'Other', 'Just Muslim'];
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

    const allHobbies = hobbiesList.default.getAllHobbies();
    const hobbies = [allHobbies[Math.floor(Math.random() * allHobbies.length)]];

    const aboutUserText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent semper. Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus.`

    const newUser = {
      name: nameChoice.name,
      email: `${nameChoice.name.toLowerCase()}@me.com`,
      password,
      loginData: [{
        time: new Date(),
        geoLocationData,
      }],
      location: { type: "Point", coordinates: [longitude, latitude] },
      startedRegistrationAt: new Date(),
      completedRegistrationAt: new Date(),
      emailVerified: new Date(),
      emailVerificationToken: '123456',
      emailVerificationTokenDateSent: new Date(),
      aboutMe: aboutUserText,
      aboutMyMatch: aboutUserText,
      age,
      city: selectLocation.city,
      country: selectLocation.country,
      countryRaisedIn: selectLocation.country,
      diet,
      education,
      ethnicity,
      fullDob,
      gender: nameChoice.gender,
      hasChildren: yesNoOptions[Math.floor(Math.random() * 2)],
      height,
      hijab: yesNoOptions[Math.floor(Math.random() * 2)],
      hobbies,
      languages,
      maritalStatus,
      photos: [],
      profession,
      religiousConviction,
      religiousValues,
      canRelocate: yesNoMaybeOptions[Math.floor(Math.random() * 3)],
      smokes: yesNoOptions[Math.floor(Math.random() * 2)],
      state: selectLocation.state,
      wantsChildren: yesNoOptions[Math.floor(Math.random() * 2)],
    };

    await db.collection('users').insertOne(newUser);

    console.log(`i: ${i + 1}/${numberOfUsers}`);
  }

  client.close();
})
