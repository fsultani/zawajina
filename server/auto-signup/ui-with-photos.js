const puppeteer = require('puppeteer');
const names = require('./names');
const countries = require('../routes/world-cities');

const numberOfUsers = 10;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });
  const allPages = await browser.pages();
  const page = allPages[0];

  await page.goto('http://localhost:3000/signup');

  const createUser = async () => {
    const DeleteEntry = async () => {
      await page.keyboard.press('Home');
      await page.keyboard.down('Shift');
      await page.keyboard.press('End');
      await page.keyboard.up('Shift');
      await page.keyboard.press('Backspace');
    }

    try {
      for (let i = 0; i < numberOfUsers; i++) {
        console.log(`i: ${i + 1}/${numberOfUsers}`);
        const coinToss = Math.round(Math.random());
        let nameChoice;
        // Create a random mix of male and female users
        // if (coinToss === 0) {
        //   nameChoice = {
        //     name: names.male[Math.floor(Math.random() * names.male.length)],
        //     gender: 'male'
        //   };
        // } else {
        //   nameChoice = {
        //     name: names.female[Math.floor(Math.random() * names.female.length)],
        //     gender: 'female'
        //   }
        // }

        // Create only female users
        nameChoice = {
          name: names.female[Math.floor(Math.random() * names.female.length)],
          gender: 'female'
        }

        const birthMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        const birthMonth = birthMonths[Math.floor(Math.random() * birthMonths.length)];
        const birthDay = Math.floor(Math.random() * 31).toString();
        const birthYear = (1999 - (Math.floor(Math.random() * 30))).toString();

        await page.goto('http://localhost:3000/signup');

        await page.waitForSelector('#name_id');
        await page.focus('#name_id');
        await page.keyboard.type(nameChoice.name);

        await page.focus('#email_id');
        await page.keyboard.type(`${nameChoice.name.toLowerCase()}@me.com`);

        await page.focus('#password');
        await page.keyboard.type('asdfasdf');

        await page.click('button[name=signupButton]');

        await page.on('response', async response => {
          if (response._status === 403) {
            console.log("response._status\n", response._status);
            await page.waitForSelector('#name_id');
            await page.focus('#name_id');
            DeleteEntry();
            await page.keyboard.type(nameChoice.name);

            await page.focus('#email_id');
            DeleteEntry();
            await page.keyboard.type(`${nameChoice.name.toLowerCase()}@me.com`);

            await page.click('button[name=signupButton]');
          }
        })

        await page.waitForSelector('#dob-month');
        await page.select('#dob-month', birthMonth);
        await page.waitFor(250);
        await page.waitForSelector('#dob-day');
        await page.select('#dob-day', birthDay);
        await page.waitFor(250);
        await page.waitForSelector('#dob-year');
        await page.select('#dob-year', birthYear);
        await page.waitFor(250);

        nameChoice.gender === 'male' ?
        await page.evaluate(() => document.querySelector('input[type="radio"][id="male"]').click()) :
        await page.evaluate(() => document.querySelector('input[type="radio"][id="female"]').click());

        const allCities = countries.default.getAllCities()
        const randomCityIndex = Math.floor(Math.random() * allCities.length - 1)
        const randomCity = allCities[randomCityIndex]
        console.log('randomCity:\n', randomCity)
        const { city } = randomCity;

        // await page.waitFor(250);
        await page.focus('#myInput');
        await page.waitFor(250);
        await page.keyboard.type(city);
        await page.waitForSelector('.autocomplete-items');
        await page.waitFor(250);
        await page.keyboard.press('ArrowDown');
        await page.waitFor(250);
        await page.keyboard.press('Enter');

        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });

        const [fileChoose1] = await Promise.all([
          page.waitForFileChooser(),
          page.evaluate(() => document.querySelector('.image-1').click()),
        ])

        await fileChoose1.accept(['/Users/farid/Downloads/trees/butterfly-1127666__480.jpg']);
        await page.waitFor(250);

        const [fileChoose2] = await Promise.all([
          page.waitForFileChooser(),
          page.evaluate(() => document.querySelector('.image-2').click()),
        ])

        await fileChoose2.accept(['/Users/farid/Downloads/trees/dandelion-445228__480.jpg']);
        await page.waitFor(250);

        const [fileChoose3] = await Promise.all([
          page.waitForFileChooser(),
          page.evaluate(() => document.querySelector('.image-3').click()),
        ])

        await fileChoose3.accept(['/Users/farid/Downloads/trees/forest-931706__480.jpg']);
        await page.waitFor(250);

        const [fileChoose4] = await Promise.all([
          page.waitForFileChooser(),
          page.evaluate(() => document.querySelector('.image-4').click()),
        ])

        await fileChoose4.accept(['/Users/farid/Downloads/trees/road-1072823__480.jpg']);
        await page.waitFor(250);

        const [fileChoose5] = await Promise.all([
          page.waitForFileChooser(),
          page.evaluate(() => document.querySelector('.image-5').click()),
        ])

        await fileChoose5.accept(['/Users/farid/Downloads/trees/the-road-815297__480.jpg']);
        await page.waitFor(250);

        const [fileChoose6] = await Promise.all([
          page.waitForFileChooser(),
          page.evaluate(() => document.querySelector('.image-6').click()),
        ])

        await fileChoose6.accept(['/Users/farid/Downloads/trees/tree-736885_1280.jpg']);
        await page.waitFor(500);

        await page.waitForSelector('.signup-button');
        await page.click('button[name=createNewAccount]');
        await page.waitFor(500);

        await page.waitForSelector('#logout');
        await page.evaluate(() => document.querySelector('#logout').click());
        console.log("\n************************************************************")
      }
    } catch (error) {
      console.log('error:\n', error)
      return browser.close();
    }
  }

  await createUser();

  console.log("done");
  await browser.close();
})();
