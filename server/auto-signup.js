const puppeteer = require('puppeteer');
const names = require('./names');
const countries = require('country-state-city');

const numberOfUsers = 5;

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

  const createFaridsUser = async () => {
    await page.waitForSelector('#name_id');
    await page.focus('#name_id');
    await page.keyboard.type("Farid");

    await page.focus('#email_id');
    await page.keyboard.type('farid@me.com');

    await page.focus('#password');
    await page.keyboard.type('asdfasdf');

    await page.click('button[name=signupButton]');

    await page.waitForSelector('#dob-month');
    await page.select('#dob-month', 'october');
    await page.select('#dob-day', '14');
    await page.select('#dob-year', '1983');

    await page.evaluate(() => document.querySelector('input[type="radio"][id="male"]').click());

    const countriesList = countries.default.getAllCountries();
    const country = countriesList[Math.floor(Math.random() * countriesList.length)];

    await page.waitForSelector('#countries-list');
    await page.select('#countries-list', 'United States');
    await page.waitForSelector('#states-list');
    await page.select('#states-list', 'California');
    await page.waitForSelector('#cities-list');
    await page.select('#cities-list', 'Orange');

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    const [fileChoose1] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector('.image-1').click()),
    ])

    await fileChoose1.accept(['/Users/farid/Downloads/acorns.jpg']);
    await page.waitFor(500);

    await page.waitForSelector('.signup-button');
    await page.click('button[name=createNewAccount]');
    await page.waitFor(500);

    await page.waitForSelector('#logout');
    await page.evaluate(() => document.querySelector('#logout').click());
  }

  const createOtherUsers = async () => {
    const DeleteEntry = async () => {
      await page.keyboard.press('Home');
      await page.keyboard.down('Shift');
      await page.keyboard.press('End');
      await page.keyboard.up('Shift');
      await page.keyboard.press('Backspace');
    }

    for (let i = 0; i < numberOfUsers; i++) {
      const coinToss = Math.round(Math.random());
      let nameChoice;
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
      nameChoice = {
        name: names.female[Math.floor(Math.random() * names.female.length)],
        gender: 'female'
      }

      const birthMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
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
      await page.select('#dob-day', birthDay);
      await page.select('#dob-year', birthYear);

      nameChoice.gender === 'male' ?
      await page.evaluate(() => document.querySelector('input[type="radio"][id="male"]').click()) :
      await page.evaluate(() => document.querySelector('input[type="radio"][id="female"]').click());

      const countriesList = countries.default.getAllCountries();
      const country = countriesList[Math.floor(Math.random() * countriesList.length)];

      await page.select('#countries-list', country.name);

      if (country.id === 231) {
        const stateList = countries.default.getStatesOfCountry('231');
        const state = stateList[Math.floor(Math.random() * stateList.length)];

        await page.waitForSelector('#states-list');
        await page.select('#states-list', state.name);

        const citiesList = countries.default.getCitiesOfState(state.id);
        const city = citiesList[Math.floor(Math.random() * citiesList.length)];
        await page.select('#cities-list', city.name);
      } else {
        const citiesList = countries.default.getStatesOfCountry(country.id);
        const city = citiesList[Math.floor(Math.random() * citiesList.length)];
        await page.select('#cities-list', city.name);
      };

      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      const [fileChoose1] = await Promise.all([
        page.waitForFileChooser(),
        page.evaluate(() => document.querySelector('.image-1').click()),
      ])

      await fileChoose1.accept(['/Users/farid/Downloads/trees/butterfly-1127666__480.jpg']);
      await page.waitFor(500);

      const [fileChoose2] = await Promise.all([
        page.waitForFileChooser(),
        page.evaluate(() => document.querySelector('.image-2').click()),
      ])

      await fileChoose2.accept(['/Users/farid/Downloads/trees/dandelion-445228__480.jpg']);
      await page.waitFor(500);

      const [fileChoose3] = await Promise.all([
        page.waitForFileChooser(),
        page.evaluate(() => document.querySelector('.image-3').click()),
      ])

      await fileChoose3.accept(['/Users/farid/Downloads/trees/forest-931706__480.jpg']);
      await page.waitFor(500);

      const [fileChoose4] = await Promise.all([
        page.waitForFileChooser(),
        page.evaluate(() => document.querySelector('.image-4').click()),
      ])

      await fileChoose4.accept(['/Users/farid/Downloads/trees/road-1072823__480.jpg']);
      await page.waitFor(500);

      const [fileChoose5] = await Promise.all([
        page.waitForFileChooser(),
        page.evaluate(() => document.querySelector('.image-5').click()),
      ])

      await fileChoose5.accept(['/Users/farid/Downloads/trees/the-road-815297__480.jpg']);
      await page.waitFor(500);

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
      console.log(`i: ${i + 1}/${numberOfUsers}`);
    }
  }

  // await createFaridsUser();
  await createOtherUsers();

  console.log("done");
  await browser.close();
})();
