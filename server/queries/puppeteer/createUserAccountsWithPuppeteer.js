/*
node server/queries/puppeteer/createUserAccountsWithPuppeteer.js --gender=female --numberOfPhotos=0 --numberOfUsers=1
*/

require('dotenv').config();
const { MongoClient } = require('mongodb');
const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary');
require('../../config/cloudinary');

const femaleNames = require('../../data/female-names');
const maleNames = require('../../data/male-names');
const birthMonths = require('../../data/birthMonths');
const professionsList = require('../../data/professionsList');
const heights = require('../../data/heights');

const worldCities = require('../../data/world-cities');
const ethnicities = require('../../data/ethnicities');
const languagesList = require('../../data/languages');
const hobbiesList = require('../../data/hobbies');

require('../../config/cloudinary');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const processArgv = process.argv.slice(2);

if (!processArgv[0] && !processArgv[1] && !processArgv[2]) {
  console.log(`Missing arguments: --gender=female --numberOfPhotos=0 --numberOfUsers=1`);
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
  console.log(`Missing arguments: --gender=female --numberOfPhotos=0 --numberOfUsers=1`);
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

let browser;
let database;
const createAccount = async (newEmail = false) => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1500,1600'
      ],
    });
  }

  try {
    const usersQuery = { name: { $ne: 'Farid' }};
    const usersCollection = database.collection('users');
    const logsCollection = database.collection('logs');

    const usersCursorCount = await usersCollection.countDocuments(usersQuery);
    console.log(`usersCursorCount\n`, usersCursorCount);

    if (usersCursorCount > 0) {
      const usersCursor = await usersCollection.find(usersQuery).toArray();

      Promise.all(usersCursor.map(async (user, index) => {
        const userId = user._id.toString();

        await cloudinary.v2.api.resources({ max_results: 10 }, async (resourcesError, resourcesResults) => {
          if (resourcesError) return resourcesError;
          if (resourcesResults.resources.length > 0) {
            resourcesResults.resources.filter(item => item.folder === userId).map(item => {
              console.log({ 'item': item });
              cloudinary.v2.uploader.destroy(item.public_id, function (destroyError, destroyResult) {
                if (destroyError) return console.log('destroyError:\n', destroyError);
                console.log('destroyResult:\n', destroyResult);
              });
            });
          }
        });

        await cloudinary.v2.api.root_folders(async (root_foldersError, root_foldersResults) => {
          if (root_foldersError) return root_foldersError;
          if (root_foldersResults.folders.length > 0) {
            root_foldersResults.folders.filter(folder => folder.name === userId).map(folder => {
              console.log({ 'folder': folder });
              cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
                if (error) return console.log('error:\n', error);
                console.log('result:\n', result);
              });
            });
          }
        });

        await usersCollection.deleteOne({ _id: user._id });

        const logsCursor = await logsCollection.findOne({ _id: user._id });

        if (logsCursor) {
          await logsCollection.deleteOne({ _id: user._id });
          console.log(`${index + 1} of ${usersCursor.length} user accounts deleted`);
        }
      }));
    }

    const allPages = await browser.pages();
    const page = allPages[0];

    const keyboardTypeDelay = 25;
    const shortDelay = 100;
    const longDelay = 1000;

    /*
      Mobile device:
      const mobilePhone = puppeteer.devices['iPhone X']
      await page.emulate(mobilePhone)
     */

    await page.goto('http://localhost:3000/signup');

    const userName = gender === 'female' ?
      femaleNames[Math.floor(Math.random() * femaleNames.length)] :
      maleNames[Math.floor(Math.random() * maleNames.length)];

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

    const yesNoOptions = ['Yes', 'No'];
    const yesNoDoesNotMatterOptions = ['Yes', 'No', 'Maybe'];

    await page.focus('.username');
    await page.keyboard.type(nameChoice.name, { delay: keyboardTypeDelay });

    await page.focus('.userEmail');
    await page.keyboard.type(nameChoice.email, { delay: keyboardTypeDelay });

    await page.focus('.userPassword');
    await page.keyboard.type('asdfasdf', { delay: keyboardTypeDelay });

    await page.click('button[type="submit"]');
    await page.waitForTimeout(shortDelay);

    await page.waitForNavigation();
    await page.waitForResponse(response => response.url());

    const user = await usersCollection.findOne({ email: nameChoice.email });
    const emailVerificationToken = user.emailVerificationToken.toString();

    await page.focus('.verification');
    await page.keyboard.type(emailVerificationToken, { delay: keyboardTypeDelay });
    await page.waitForTimeout(shortDelay);

    await page.click('button[type="submit"]');
    await page.waitForTimeout(shortDelay);

    await page.waitForNavigation();
    await page.waitForResponse(response => response.url());

    const birthMonth = birthMonths[Math.floor(Math.random() * birthMonths.length)];
    const birthDay = Math.floor(Math.random() * 31).toString();
    const birthYear = (1999 - Math.floor(Math.random() * 30)).toString();

    await page.waitForTimeout(shortDelay);
    await page.waitForSelector('#dob-month');
    await page.select('#dob-month > .select-wrapper', birthMonth);
    await page.waitForTimeout(shortDelay);
    await page.select('#dob-day > .select-wrapper', birthDay);
    await page.waitForTimeout(shortDelay);
    await page.select('#dob-year > .select-wrapper', birthYear);

    await page.waitForTimeout(longDelay);
    await (await page.waitForSelector(`label[for=${gender}]`)).click();
    await page.waitForTimeout(shortDelay);

    if (gender === 'female') {
      await page.waitForSelector('.hijab');
      await page.select('.hijab', `hijab${yesNoOptions[Math.floor(Math.random() * 2)]}`);
      await page.waitForTimeout(shortDelay);
    }

    await page.evaluate(() => window.scrollBy(0, 350));

    const allLocations = worldCities.default.getAllCities();
    const location = allLocations.filter(location => {
      return location.country === 'United States';
      // return location.country === 'Saudi Arabia';
      // return location.country === 'United Arab Emirates';
      // return location.country === 'Saudi Arabia' || location.country === 'United Arab Emirates';
      // return location.country === 'United States' || location.country === 'Saudi Arabia' || location.country === 'United Arab Emirates';
    });

    const selectLocation = location[Math.floor(Math.random() * location.length)];

    await page.focus('#locationInput');
    await page.keyboard.type(selectLocation.city, { delay: keyboardTypeDelay });
    await page.waitForSelector('.autocomplete-items');
    await page.waitForTimeout(shortDelay);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(shortDelay);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(shortDelay);

    await page.focus('#countryRaisedInInput');
    await page.keyboard.type('states', { delay: keyboardTypeDelay });
    await page.waitForSelector('.autocomplete-items');
    await page.waitForTimeout(shortDelay);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(shortDelay);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(shortDelay);

    const allEthnicities = ethnicities.default.getAllEthnicities();
    const randomEthnicity = Math.floor(Math.random() * allEthnicities.length);
    const ethnicity = allEthnicities[randomEthnicity];

    await page.focus('#ethnicityInput');
    await page.keyboard.type(ethnicity, { delay: keyboardTypeDelay });
    await page.waitForSelector('.autocomplete-items');
    await page.waitForTimeout(shortDelay);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(shortDelay);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(shortDelay);

    const allLanguages = languagesList.default.getAllLanguages();
    const languages = allLanguages[Math.floor(Math.random() * allLanguages.length)];

    await page.focus('#languageInput');
    await page.keyboard.type(languages, { delay: keyboardTypeDelay });
    await page.waitForSelector('.autocomplete-items');
    await page.waitForTimeout(shortDelay);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(shortDelay);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(shortDelay);

    const allReligiousConvictions = ['Sunni', 'Shia', 'Just Muslim'];
    const religiousConviction = allReligiousConvictions[Math.floor(Math.random() * allReligiousConvictions.length)];

    await page.waitForSelector('#religious-conviction');
    await page.select('#religious-conviction > .select-wrapper', religiousConviction);
    await page.waitForTimeout(shortDelay);

    const allReligiousValues = ['Conservative', 'Moderate', 'Liberal'];
    const religiousValues = allReligiousValues[Math.floor(Math.random() * allReligiousValues.length)];

    await page.waitForSelector('#religious-values');
    await page.select('#religious-values > .select-wrapper', religiousValues);
    await page.waitForTimeout(shortDelay);

    const allMaritalStatuses = ['Never Married', 'Divorced', 'Widowed'];
    const maritalStatus = allMaritalStatuses[Math.floor(Math.random() * allMaritalStatuses.length)];

    await page.waitForSelector('#marital-status');
    await page.select('#marital-status > .select-wrapper', maritalStatus);
    await page.waitForTimeout(shortDelay);

    const allEducationLevels = ['High School', `Bachelor's degree`, `Master's degree`, 'Doctoral degree']
    const education = allEducationLevels[Math.floor(Math.random() * allEducationLevels.length)];

    await page.waitForSelector('#education');
    await page.select('#education > .select-wrapper', education);
    await page.waitForTimeout(shortDelay);

    await page.evaluate(() => window.scrollBy(0, 500));

    const profession = professionsList[Math.floor(Math.random() * professionsList.length)];

    await page.waitForSelector('#profession');
    await page.select('#profession > .select-wrapper', profession);
    await page.waitForTimeout(shortDelay);

    const height = heights[Math.floor(Math.random() * heights.length)];

    await page.waitForSelector('#user-height');
    await page.select('#user-height > .select-wrapper', height.toString());
    await page.waitForTimeout(shortDelay);

    await page.waitForSelector('#can-relocate');
    await page.select('#can-relocate > .select-wrapper', `canRelocate${yesNoOptions[Math.floor(Math.random() * 2)]}`);
    await page.waitForTimeout(shortDelay);

    const allDiets = ['Halal only', 'Halal when possible', 'Eat anything', 'Eat anything except pork', 'Vegetarian'];
    const diet = allDiets[Math.floor(Math.random() * allDiets.length)];

    await page.waitForSelector('#diet');
    await page.select('#diet > .select-wrapper', diet);
    await page.waitForTimeout(shortDelay);

    await page.waitForSelector('#has-children');
    await page.select('#has-children > .select-wrapper', `hasChildren${yesNoOptions[Math.floor(Math.random() * 2)]}`);
    await page.waitForTimeout(shortDelay);

    await page.waitForSelector('#wants-children');
    await page.select('#wants-children > .select-wrapper', `wantsChildren${yesNoDoesNotMatterOptions[Math.floor(Math.random() * 2)]}`);
    await page.waitForTimeout(shortDelay);

    await page.waitForSelector('#smokes');
    await page.select('#smokes > .select-wrapper', `smokes${yesNoOptions[Math.floor(Math.random() * 2)]}`);
    await page.waitForTimeout(shortDelay);

    const prayerLevels = ['Rarely', 'Sometimes', 'Always'];
    const prayerLevel = prayerLevels[Math.floor(Math.random() * prayerLevels.length)];

    await page.waitForSelector('#prayer-level');
    await page.select('#prayer-level > .select-wrapper', prayerLevel);
    await page.waitForTimeout(shortDelay);

    const allHobbies = hobbiesList.default.getAllHobbies();
    const hobby = allHobbies[Math.floor(Math.random() * allHobbies.length)];
    const hobbyLabel = hobbiesList.default.getAllHobbies().find(item => item.toLowerCase().startsWith(hobby.toLowerCase()))

    await page.focus('#hobbiesInput');
    await page.waitForTimeout(shortDelay);
    await page.keyboard.type(hobby, { delay: keyboardTypeDelay });
    await page.waitForTimeout(longDelay);
    await (await page.waitForSelector(`label[for="${hobbyLabel}"]`)).click();
    await page.waitForTimeout(longDelay);

    /* This format correctly creates appropriately-aligned paragraphs */
    await page.focus('.about-me');
    await page.evaluate(() => document.querySelector(`.about-me`).value = `Lorem ipsum dolor sit amet & consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    
  Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent semper. Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus Subḥān Allāh.`);

    await page.focus('.about-my-match');
    await page.evaluate(() => document.querySelector(`.about-my-match`).value = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent "semper".
    
  Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus Subḥān Allāh.`);

    const photos = [
      '/Users/farid/Downloads/temp/IMG_0041.jpg',
      '/Users/farid/Downloads/temp/IMG_0047.jpg',
      '/Users/farid/Downloads/temp/IMG_0048.jpg',
      '/Users/farid/Downloads/temp/IMG_0051.jpg',
      '/Users/farid/Downloads/temp/IMG_0053.jpg',
      '/Users/farid/Downloads/temp/IMG_0063.jpg',
    ];

    await page.evaluate(() => window.scrollBy(0, 1000));

    for (let index = 0; index < numberOfPhotos; index++) {
      await page.waitForTimeout(longDelay);

      const [fileChoose] = await Promise.all([
        page.waitForFileChooser(),
        page.evaluate(index => document.querySelector(`.image-${index}`).click(), index),
      ]);

      await fileChoose.accept([photos[index]]);
    }

    await page.waitForTimeout(longDelay);

    await page.click('button[type="submit"]');

    const formErrorsIsVisible = await page.$eval('.form-errors', element => element.getAttribute('style' === 'display: inline-block;'))
    if (formErrorsIsVisible) {
      throw new Error('There should be no errors')
    }

    await page.waitForNavigation();

    if (page.url() !== `http://localhost:3000/search`) {
      throw new Error(`The URL was not http://localhost:3000/search`);
    }

    await page.evaluate(() => document.querySelector(`a[href='/search']`).click());

    await page.waitForNavigation();
    await page.evaluate(() => document.querySelector('.dropdown-button').click());
    await page.evaluate(() => document.querySelector('#logout').click());

    await page.waitForNavigation();
    if (page.url() !== `http://localhost:3000/login`) {
      throw new Error(`The URL was not http://localhost:3000/login`);
    }
  } catch (error) {
    const errorMessage = error.response?.data ?? error.message;
    console.log(`errorMessage - server/queries/puppeteer/createUserAccountsWithPuppeteer.js:454\n`, errorMessage);
    if (error.response?.data?.message === 'Account already exists' || error.response?.data?.message === 'Invalid dob-month') {
      await createAccount(true);
    }
  }
}

(async () => {
  try {
    await client.connect();

    if (!database) database = client.db('development');
    await database.command({ ping: 1 });
    console.log('Connected successfully to server');

    for (let index = 0; index < numberOfUsers; index++) {
      await createAccount();
      console.log(`${index + 1}/${numberOfUsers} accounts created`);
    }

    await client.close();
    console.log(`Close client`);

    // await browser.close();
    console.log(`Close puppeteer browser`);
  } catch (error) {
    console.log(`error - server/queries/puppeteer/createUserAccountsWithPuppeteer.js:509\n`, error);
  }
})();
