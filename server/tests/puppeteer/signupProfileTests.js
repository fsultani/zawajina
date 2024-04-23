/*
node server/tests/puppeteer/signupProfileTests.js --numberOfPhotos=0
*/

require('dotenv').config();
const { MongoClient } = require('mongodb');
const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary');
const hobbiesList = require('../../data/hobbies');

const greenConsoleLogColor = '32m';
const redConsoleLogColor = '91m';

const successConsoleLog = (message = '') => console.log(`\x1b[${greenConsoleLogColor}${message} \x1b[0m`);
const errorConsoleLog = (message = '') => console.log(`\x1b[${redConsoleLogColor}${message} \x1b[0m`);
const throwError = (message = 'Error') => {
  throw new Error(`\x1b[${redConsoleLogColor}${message} \x1b[0m`);
}

require('../../config/cloudinary');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const processArgv = process.argv.slice(2);

if (!processArgv[0]) {
  throwError(`Missing arguments: --numberOfPhotos=0`)
}

const firstArgument = processArgv[0]?.split('=')[0];

if (firstArgument !== '--numberOfPhotos') {
  throwError(`Missing arguments: --numberOfPhotos=0`)
}

/* ************************* */

let numberOfPhotos;
if (firstArgument === '--numberOfPhotos') {
  numberOfPhotos = Number(processArgv[0].split('=')[1]);
}

if (numberOfPhotos > 3) {
  throwError(`numberOfPhotos must be less than 4`)
}

const keyboardTypeDelay = 25;
const shortWait = 100;
const longWait = 300;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1500,1600'
    ],
  });

  try {
    await client.connect();
    const database = client.db('development');
    await database.command({ ping: 1 });
    console.log('Connected successfully to server');

    const usersQuery = { name: { $regex: /farid/i } };
    const usersCollection = database.collection('users');
    const logsCollection = database.collection('logs');

    const userAccountExists = await usersCollection.countDocuments(usersQuery) > 0;
    console.log({ 'userAccountExists': userAccountExists });

    if (userAccountExists) {
      const userAccount = await usersCollection.find(usersQuery).toArray();

      Promise.all(userAccount.map(async (user, index) => {
        const userId = user._id.toString();

        await cloudinary.v2.api.resources({ max_results: 10 }, async (resourcesError, resourcesResults) => {
          if (resourcesError) return resourcesError;
          if (resourcesResults.resources.length > 0) {
            resourcesResults.resources.filter(item => item.folder === userId).map(item => {
              console.log(`item - server/queries/puppeteer/create-farids-user.js:41\n`, item);
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
              console.log(`folder - server/queries/puppeteer/create-farids-user.js:54\n`, folder);
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
          console.log(`${userAccount.length} user ${userAccount.length === 1 ? 'account' : 'accounts'} deleted`);
        }
      }));
    }

    const allPages = await browser.pages();
    const page = allPages[0];

    await page.setViewport({ width: 1280, height: 1400 });

    /*
      Mobile device:
      const mobilePhone = puppeteer.devices['iPhone X']
      await page.emulate(mobilePhone)
     */

    await page.goto('http://localhost:3000/signup');

    await page.focus('.username');
    await page.keyboard.type('Farid', { delay: keyboardTypeDelay });

    const userEmail = 'faridsultani.ba@gmail.com';

    await page.focus('.userEmail');
    await page.keyboard.type(userEmail, { delay: keyboardTypeDelay });

    await page.focus('.userPassword');
    await page.keyboard.type('asdfasdf', { delay: keyboardTypeDelay });

    await page.waitForTimeout(longWait);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(shortWait);

    await page.waitForNavigation();
    await page.waitForResponse(response => response.url());

    const user = await usersCollection.findOne({ email: userEmail });
    const emailVerificationToken = user.emailVerificationToken.toString();

    await page.focus('.verification');
    await page.keyboard.type(emailVerificationToken, { delay: keyboardTypeDelay });
    await page.waitForTimeout(shortWait);

    await page.waitForTimeout(longWait);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(shortWait);

    await page.waitForNavigation();
    await page.waitForResponse(response => response.url());

    const tests = [
      {
        elementName: '#dob-month',
      },
      {
        elementName: '#dob-day',
      },
      {
        elementName: '#dob-year',
      },
      {
        elementName: '#gender',
      },
      {
        elementName: '#locationInput',
      },
      {
        elementName: '#countryRaisedInInput',
      },
      {
        elementName: '#ethnicityInput',
      },
      {
        elementName: '#languageInput',
      },
      {
        elementName: '#religious-conviction',
      },
      {
        elementName: '#religious-values',
      },
      {
        elementName: '#marital-status',
      },
      {
        elementName: '#education',
      },
      {
        elementName: '#profession',
      },
      {
        elementName: '#user-height',
      },
      {
        elementName: '#can-relocate',
      },
      {
        elementName: '#diet',
      },
      {
        elementName: '#has-children',
      },
      {
        elementName: '#wants-children',
      },
      {
        elementName: '#smokes',
      },
      {
        elementName: '#prayer-level',
      },
      {
        elementName: '.about-me',
      },
      {
        elementName: '.about-my-match',
      },
    ];

    const formElements = [
      {
        elementType: 'select',
        elementName: '#dob-month',
        elementValue: '10',
      },
      {
        elementType: 'select',
        elementName: '#dob-day',
        elementValue: '14',
      },
      {
        elementType: 'select',
        elementName: '#dob-year',
        elementValue: '1983',
      },
      {
        elementType: 'radio',
        elementName: '#gender',
        elementValue: 'male',
      },
      {
        elementType: 'input',
        elementName: '#locationInput',
        elementValue: 'orange',
      },
      {
        elementType: 'input',
        elementName: '#countryRaisedInInput',
        elementValue: 'states',
      },
      {
        elementType: 'input',
        elementName: '#ethnicityInput',
        elementValue: 'afghan',
      },
      {
        elementType: 'input',
        elementName: '#languageInput',
        elementValue: 'english',
      },
      {
        elementType: 'input',
        elementName: '#languageInput',
        elementValue: 'farsi',
      },
      {
        elementType: 'select',
        elementName: '#religious-conviction',
        elementValue: 'Sunni',
      },
      {
        elementType: 'select',
        elementName: '#religious-values',
        elementValue: 'Conservative',
      },
      {
        elementType: 'select',
        elementName: '#marital-status',
        elementValue: 'Never Married',
      },
      {
        elementType: 'select',
        elementName: '#education',
        elementValue: 'Bachelor\'s degree',
      },
      {
        elementType: 'select',
        elementName: '#profession',
        elementValue: 'Engineer',
      },
      {
        elementType: 'select',
        elementName: '#profession',
        elementValue: 'Engineer',
      },
      {
        elementType: 'select',
        elementName: '#user-height',
        elementValue: '180',
      },
      {
        elementType: 'select',
        elementName: '#can-relocate',
        elementValue: 'canRelocateNo',
      },
      {
        elementType: 'select',
        elementName: '#diet',
        elementValue: 'Halal when possible',
      },
      {
        elementType: 'select',
        elementName: '#has-children',
        elementValue: 'hasChildrenNo',
      },
      {
        elementType: 'select',
        elementName: '#wants-children',
        elementValue: 'wantsChildrenMaybe',
      },
      {
        elementType: 'select',
        elementName: '#smokes',
        elementValue: 'smokesNo',
      },
      {
        elementType: 'select',
        elementName: '#prayer-level',
        elementValue: 'Always',
      },
      {
        elementType: 'hobbies',
        elementName: '#hobbiesInput',
        elementValue: 'coding',
      },
      {
        elementType: 'about-me',
        elementName: '.about-me',
        elementValue: '',
      },
      {
        elementType: 'about-my-match',
        elementName: '.about-my-match',
        elementValue: '',
      },
      {
        elementType: 'submit',
        elementName: 'submit',
        elementValue: '',
      },
    ]

    const run = async element => {
      for (const formElement of formElements) {
        await page.waitForTimeout(200);

        if (formElement.elementType === 'select' && element !== formElement.elementName) {
          await page.select(`${formElement.elementName} > .select-wrapper`, formElement.elementValue);
        }

        if (formElement.elementType === 'radio' && element !== formElement.elementName) {
          await (await page.waitForSelector(`${formElement.elementName} > label[for=${formElement.elementValue}]`)).click();
        }

        if (formElement.elementType === 'input' && element !== formElement.elementName) {
          await page.focus(formElement.elementName);
          await page.keyboard.type(formElement.elementValue, { delay: keyboardTypeDelay });
          await page.waitForSelector('.autocomplete-items');
          await page.waitForTimeout(shortWait);
          await page.keyboard.press('ArrowDown');
          await page.waitForTimeout(shortWait);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(shortWait);
        }

        if (formElement.elementType === 'hobbies' && element !== formElement.elementName) {
          await page.evaluate(() => {
            window.scrollBy(0, 1000);
          });

          const hobbyLabel = hobbiesList.default.getAllHobbies().find(item => item.toLowerCase().startsWith(formElement.elementValue.toLowerCase()))
          await page.focus(formElement.elementName);
          await page.keyboard.type(formElement.elementValue, { delay: keyboardTypeDelay });
          await page.waitForTimeout(500);
          await (await page.waitForSelector(`label[for="${hobbyLabel}"]`)).click();
        }

        if (formElement.elementType === 'about-me' && element !== formElement.elementName) {
          await page.focus(formElement.elementName);
          await page.evaluate(() => document.querySelector(`.about-me`).value = `Lorem ipsum dolor sit amet & consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent semper. Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus Subḥān Allāh.`);
        }

        if (formElement.elementType === 'about-my-match' && element !== formElement.elementName) {
          await page.focus(formElement.elementName);
          await page.evaluate(() => document.querySelector(`.about-my-match`).value = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent "semper".

Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus Subḥān Allāh.`);
        }

        if (formElement.elementType === 'submit') {
          await page.click('button[type="submit"]'); 
        } 
      }
    }

    for (const test of tests) {
      await run(test.elementName)
      const index = tests.indexOf(test);

      const formErrorsIsVisible = await page.$eval(test.elementName, element => {
        const classValue = element.getAttribute('class');
        return classValue.match(/form-error/i);
      });

      if (formErrorsIsVisible) {
        const message = `Test ${index + 1} of ${tests.length} - ${test.elementName} error shows correctly`
        successConsoleLog(message);
      } else {
        const message = `${test.elementName} should show an error`
        errorConsoleLog(message);
      }

      if (index < tests.length - 1) {
        await page.waitForTimeout(1000);
        await page.reload();
        await page.waitForTimeout(1000);
      }
    }
  } catch (error) {
    console.log(`error - server/queries/puppeteer/create-farids-user.js:294\n`, error);
  } finally {
    await client.close();
    console.log(`Close client`);

    // await browser.close();
    console.log(`Close puppeteer browser`);
  }
})();
