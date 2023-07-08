require('dotenv').config();
const { MongoClient } = require('mongodb');
const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary');
const { phoneNumber, invalidCharacters, digit, webLinks } = require('../data');
const { socialMediaAccounts, socialMediaTags } = require('../../utils');

require('../../config/cloudinary');

/*
  node server/tests/puppeteer/create-farids-user.js
*/

const greenConsoleLogColor = '32m';
const yellowConsoleLogColor = '33m';
const redConsoleLogColor = '91m';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const nameTests = [
  {
    testType: 'socialMediaAccounts',
    data: socialMediaAccounts,
    message: 'No email or social media accounts allowed',
  },
  {
    testType: 'socialMediaTags',
    data: socialMediaTags,
    message: 'No email or social media accounts allowed',
  },
  {
    testType: 'phoneNumber',
    data: phoneNumber,
    message: 'Phone numbers are not allowed',
  },
  {
    testType: 'invalidCharacters',
    data: invalidCharacters,
    message: 'Name cannot contain special characters',
  },
  {
    testType: 'digit',
    data: digit,
    message: 'Name cannot contain a number',
  },
  {
    testType: 'webLinks',
    data: webLinks,
    message: 'Web links are not allowed',
  },
];

const invalidEmails = [
  'faridsultani.ba',
  'faridsultani.ba@',
  'faridsultani.ba@gmail',
];

const emailTests = [
  {
    testType: 'invalidEmails',
    data: invalidEmails,
    message: 'Invalid email',
  },
];

const passwordTests = [
  '',
  'a',
  'asdfasd',
];

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

    const usersCursorCount = await usersCollection.countDocuments(usersQuery);

    if (usersCursorCount > 0) {
      const usersCursor = await usersCollection.find(usersQuery).toArray();

      Promise.all(usersCursor.map(async (user, index) => {
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
          console.log(`${index + 1} of ${usersCursor.length} user accounts deleted`);
        }
      }));
    }

    const allPages = await browser.pages();
    const page = allPages[0];
    await page.setViewport({ width: 1280, height: 1400 })

    const keyboardTypeDelay = 25;
    const waitForTimeoutValue = 500;

    const nameErrorMessages = [];
    for (const nameTest of nameTests) {
      console.log(`\x1b[${yellowConsoleLogColor} ${nameTest.testType} ${nameTest.data.length === 1 ? 'test' : 'tests'} \x1b[0m`);
      for (const mockName of nameTest.data) {
        await page.goto('http://localhost:3000/signup');
        const username = `Farid ${mockName}`;

        await page.focus('.username');
        await page.keyboard.type(username, { delay: keyboardTypeDelay });

        await page.focus('.userEmail');
        await page.keyboard.type('faridsultani.ba@gmail.com', { delay: keyboardTypeDelay });

        await page.focus('.userPassword');
        await page.keyboard.type('asdfasdf', { delay: keyboardTypeDelay });

        await page.click('button[type="submit"]');
        await page.waitForTimeout(waitForTimeoutValue);

        const formIsSubmitting = await page.evaluate(`document.querySelector('.submit-button-loading-spinner-wrapper').getAttribute('style')`) === 'display: flex;'

        const actualErrorMessage = await page.$eval('#name-error', el => el.textContent);
        if (!formIsSubmitting && actualErrorMessage === nameTest.message) {
          const index = nameTest.data.indexOf(mockName);
          console.log(`${index + 1} of ${nameTest.data.length}: "${username}" - \x1b[${greenConsoleLogColor} "${actualErrorMessage}" \x1b[0m`);
        } else {
          nameErrorMessages.push({
            data: mockName,
            message: nameTest.message,
          }); 
        }
      }

      console.log(`=`.repeat(50), `\n`);
    }

    if (nameErrorMessages.length > 0) {
      console.log(`\x1b[${yellowConsoleLogColor} ${nameErrorMessages.length} ${nameErrorMessages.length === 1 ? 'error' : 'errors'} \x1b[0m`);

      for (const error of nameErrorMessages) {
        console.log(`\x1b[${redConsoleLogColor} "${error}" \x1b[0m`);
      }
    } else {
      console.log(`\x1b[${greenConsoleLogColor} All name tests passed \x1b[0m`);
    }

    console.log(`-`.repeat(100), `\n`);    

    const emailErrorMessages = [];
    for (const emailTest of emailTests) {
      console.log(`\x1b[${yellowConsoleLogColor} ${emailTest.testType} ${emailTest.data.length === 1 ? 'test' : 'tests'} \x1b[0m`);
      for (const mockEmail of emailTest.data) {
        await page.goto('http://localhost:3000/signup');

        await page.focus('.username');
        await page.keyboard.type(`Farid`, { delay: keyboardTypeDelay });

        await page.focus('.userEmail');
        await page.keyboard.type(mockEmail, { delay: keyboardTypeDelay });

        await page.focus('.userPassword');
        await page.keyboard.type('asdfasdf', { delay: keyboardTypeDelay });

        await page.click('button[type="submit"]');
        await page.waitForTimeout(waitForTimeoutValue);

        const formIsSubmitting = await page.evaluate(`document.querySelector('.submit-button-loading-spinner-wrapper').getAttribute('style')`) === 'display: flex;'

        const actualErrorMessage = await page.$eval('#email-error', el => el.textContent);
        if (!formIsSubmitting && actualErrorMessage === emailTest.message) {
          const index = emailTest.data.indexOf(mockEmail);
          console.log(`${index + 1} of ${emailTest.data.length}: "${mockEmail}" - \x1b[${greenConsoleLogColor} "${actualErrorMessage}" \x1b[0m`);
        } else {
          emailErrorMessages.push({
            data: mockEmail,
            message: emailTest.message,
          });
        }
      }
    } 

    if (emailErrorMessages.length > 0) {
      console.log(``);
      console.log(`\x1b[${yellowConsoleLogColor} ${emailErrorMessages.length} ${emailErrorMessages.length === 1 ? 'error' : 'errors'} \x1b[0m`);

      for (const error of emailErrorMessages) {
        console.log(`\x1b[${redConsoleLogColor} "${error.data}" - ${error.message} \x1b[0m`);
      }
    } else {
      console.log(`\x1b[${greenConsoleLogColor} All email tests passed \x1b[0m`);
    }

    console.log(`-`.repeat(100), `\n`);

    const passwordErrors = [];
    console.log(`\x1b[${yellowConsoleLogColor} password tests'} \x1b[0m`);
    for (const passwordTest of passwordTests) {
      await page.goto('http://localhost:3000/signup');

      await page.focus('.username');
      await page.keyboard.type(`Farid`, { delay: keyboardTypeDelay });

      await page.focus('.userEmail');
      await page.keyboard.type('faridsultani.ba@gmail.com', { delay: keyboardTypeDelay });

      await page.focus('.userPassword');
      await page.keyboard.type(passwordTest, { delay: keyboardTypeDelay });

      await page.click('button[type="submit"]');
      await page.waitForTimeout(waitForTimeoutValue);

      const formIsSubmitting = await page.evaluate(`document.querySelector('.submit-button-loading-spinner-wrapper').getAttribute('style')`) === 'display: flex;'

      if (!formIsSubmitting) {
        const index = passwordTests.indexOf(passwordTest);
        console.log(`${index + 1} of ${passwordTests.length}: "${passwordTest}" \x1b[0m`);
      } else {
        passwordErrors.push(passwordTest);
      }
    }

    if (passwordErrors.length > 0) {
      console.log(``);
      console.log(`\x1b[${yellowConsoleLogColor} ${passwordErrors.length} ${passwordErrors.length === 1 ? 'error' : 'errors'} \x1b[0m`);

      for (const error of passwordErrors) {
        console.log(`\x1b[${redConsoleLogColor} "${error}" \x1b[0m`);
      }
    } else {
      console.log(`\x1b[${greenConsoleLogColor} All password tests passed \x1b[0m`);
    }

    console.log(`\x1b[${greenConsoleLogColor} Testing complete \x1b[0m`);

    console.log(`-`.repeat(100), `\n`);
  } catch (error) {
    console.log(`error - server/queries/puppeteer/create-farids-user.js:294\n`, error);
  } finally {
    await client.close();
  }
})();
