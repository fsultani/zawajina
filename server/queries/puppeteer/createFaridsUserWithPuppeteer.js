/*
node server/queries/puppeteer/createFaridsUserWithPuppeteer.js
*/

require('dotenv').config();
const { MongoClient } = require('mongodb');
const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary');
const hobbiesList = require('../../data/hobbies');

require('../../config/cloudinary');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

    const keyboardTypeDelay = 25;
    const waitForTimeoutValue = 100;

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

    await page.click('button[type="submit"]');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForNavigation();
    await page.waitForResponse(response => response.url() === 'http://localhost:3000/api/register/check-email-verification' && response.status() === 200);

    const user = await usersCollection.findOne({ email: userEmail });
    const emailVerificationToken = user.emailVerificationToken.toString();

    await page.focus('#verification-token');
    await page.keyboard.type(emailVerificationToken, { delay: keyboardTypeDelay });
    await page.waitForTimeout(waitForTimeoutValue);

    await page.click('button[type="submit"]');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForNavigation();
    await page.waitForResponse(response => response.url() === 'http://localhost:3000/api/register/hobbies' && response.status() === 200);

    await page.waitForSelector('.dob-month');
    await page.select('.dob-month', '10');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.select('.dob-day', '14');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.select('.dob-year', '1983');

    await (await page.waitForSelector('label[for=male]')).click();
    await page.waitForTimeout(waitForTimeoutValue);

    await page.focus('#locationInput');
    await page.keyboard.type('orange', { delay: keyboardTypeDelay });
    await page.waitForSelector('.autocomplete-items');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.focus('#countryRaisedInInput');
    await page.keyboard.type('states', { delay: keyboardTypeDelay });
    await page.waitForSelector('.autocomplete-items');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.focus('#ethnicityInput');
    await page.keyboard.type('afghan', { delay: keyboardTypeDelay });
    await page.waitForSelector('.autocomplete-items');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.focus('#languageInput');
    await page.keyboard.type('english', { delay: keyboardTypeDelay });
    await page.waitForSelector('.autocomplete-items');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.focus('#languageInput');
    await page.keyboard.type('farsi', { delay: keyboardTypeDelay });
    await page.waitForSelector('.autocomplete-items');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(waitForTimeoutValue);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.religious-conviction');
    await page.select('.religious-conviction', 'Sunni');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.religious-values');
    await page.select('.religious-values', 'Conservative');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.marital-status');
    await page.select('.marital-status', 'Never Married');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.education');
    await page.select('.education', 'Bachelor\'s degree');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.profession');
    await page.select('.profession', 'Engineer');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.user-height');
    await page.select('.user-height', `180`);
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.can-relocate');
    await page.select('.can-relocate', 'canRelocateNo');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.diet');
    await page.select('.diet', 'Halal when possible');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.has-children');
    await page.select('.has-children', 'hasChildrenNo');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.wants-children');
    await page.select('.wants-children', 'wantsChildrenMaybe');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.smokes');
    await page.select('.smokes', 'smokesNo');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.waitForSelector('.prayer-level');
    await page.select('.prayer-level', 'Always');
    await page.waitForTimeout(waitForTimeoutValue);

    await page.evaluate(() => {
      window.scrollBy(0, 1000);
    });

    const hobby = 'coding';
    const hobbyLabel = hobbiesList.default.getAllHobbies().find(item => item.toLowerCase().startsWith(hobby.toLowerCase()))
    await page.focus('#hobbiesInput');
    await page.keyboard.type(hobby, { delay: keyboardTypeDelay });
    await page.waitForTimeout(500);
    await (await page.waitForSelector(`label[for="${hobbyLabel}"]`)).click();

    /* This format correctly creates appropriately-aligned paragraphs */
    await page.focus('.about-me');
    await page.evaluate(() => document.querySelector(`.about-me`).value = `Lorem ipsum dolor sit amet & consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    
Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent semper. Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus Subḥān Allāh.`);

    await page.focus('.about-my-match');
    await page.evaluate(() => document.querySelector(`.about-my-match`).value = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent "semper".
    
Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus Subḥān Allāh.`);

    // const [fileChoose1] = await Promise.all([
    //   page.waitForFileChooser(),
    //   page.evaluate(() => document.querySelector('.image-0').click()),
    // ]);

    // await fileChoose1.accept(['/Users/farid/Downloads/temp/IMG_0041.jpg']);

    await page.waitForTimeout(500);

    // const [fileChoose2] = await Promise.all([
    //   page.waitForFileChooser(),
    //   page.evaluate(() => document.querySelector('.image-1').click()),
    // ]);

    // await fileChoose2.accept(['/Users/farid/Downloads/temp/IMG_0047.jpg']);

    // await page.waitForTimeout(500);

    // const [fileChoose3] = await Promise.all([
    //   page.waitForFileChooser(),
    //   page.evaluate(() => document.querySelector('.image-2').click()),
    // ]);

    // await fileChoose3.accept(['/Users/farid/Downloads/temp/IMG_0048.jpg']);

    // await page.waitForTimeout(500);

    // const [fileChoose4] = await Promise.all([
    //   page.waitForFileChooser(),
    //   page.evaluate(() => document.querySelector('.image-3').click()),
    // ]);

    // await fileChoose4.accept(['/Users/farid/Downloads/temp/IMG_0051.jpg']);

    // await page.waitForTimeout(500);

    // const [fileChoose5] = await Promise.all([
    //   page.waitForFileChooser(),
    //   page.evaluate(() => document.querySelector('.image-4').click()),
    // ]);

    // await fileChoose5.accept(['/Users/farid/Downloads/temp/IMG_0053.jpg']);

    // await page.waitForTimeout(500);

    // const [fileChoose6] = await Promise.all([
    //   page.waitForFileChooser(),
    //   page.evaluate(() => document.querySelector('.image-5').click()),
    // ]);

    // await fileChoose6.accept(['/Users/farid/Downloads/temp/IMG_0063.jpg']);

    await page.waitForTimeout(1000);

    await page.click('button[type="submit"]');

    const formErrorsIsVisible = await page.$eval('.form-errors', element => element.getAttribute('style' === 'display: inline-block;'))
    if (formErrorsIsVisible) {
      throw new Error('There should be no errors')
    }

    await page.waitForNavigation();

    const url = page.url();
    if (url !== `http://localhost:3000/search`) {
      throw new Error(`The URL was not http://localhost:3000/search`);
    }

    await page.waitForTimeout(1000);

    await page.evaluate(() => document.querySelector(`a[href='/search']`).click())
  } catch (error) {
    console.log(`error - server/queries/puppeteer/create-farids-user.js:294\n`, error);
  } finally {
    await client.close();
    console.log(`Close client`);

    // await browser.close();
    console.log(`Close puppeteer browser`);
  }
})();
