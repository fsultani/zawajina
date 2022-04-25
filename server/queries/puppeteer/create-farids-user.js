require('dotenv').config();
const { MongoClient } = require('mongodb');
const puppeteer = require("puppeteer");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: require("/Users/farid/_repos/my-match/server/credentials.json").CLOUDINARY_CLOUD_NAME,
  api_key: require("/Users/farid/_repos/my-match/server/credentials.json").CLOUDINARY_API_KEY,
  api_secret: require("/Users/farid/_repos/my-match/server/credentials.json").CLOUDINARY_API_SECRET,
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    return client;
  } catch (error) {
    console.log(`error\n`, error);
  }
}

(async () => {
  const client = await run().catch(console.dir);
  const database = client.db('my-match-dev');
  const usersCollection = database.collection('users');
  const query = { name: { $regex: /farid/i } };

  let faridExists = await usersCollection.findOne(query);
  if (faridExists) {
    await cloudinary.v2.api.resources({ max_results: 10 }, async (error, results) => {
      results.resources.map(item => {
        cloudinary.v2.uploader.destroy(item.public_id, function(error, result) {
          if (error) return console.log("error:\n", error);
          console.log("result:\n", result);
        });
      });
    });

    await cloudinary.v2.api.root_folders(async (error, results) => {
      results.folders.map(folder => {
        cloudinary.v2.api.delete_folder(folder.name, function(error, result) {
          if (error) return console.log("error:\n", error);
          console.log("result:\n", result);
        });
      });
    });

    const deleteUser = await usersCollection.deleteOne({ 'email': 'farid@me.com' })
    console.log(`deleteUser.deletedCount\n`, deleteUser.deletedCount);
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1500,1600'
    ],
  });
  const allPages = await browser.pages();
  const page = allPages[0];
  await page.setViewport({ width: 1280, height: 1400 })

  const keyboardTypeDelay = 0;

  await page.goto("http://localhost:3000/signup");

  await page.waitForSelector("#user_name");
  await page.focus("#user_name");
  await page.keyboard.type("Farid", { delay: keyboardTypeDelay });

  await page.focus("#user_email");
  await page.keyboard.type("farid@me.com", { delay: keyboardTypeDelay });

  await page.focus("#user_password");
  await page.keyboard.type("asdfasdf", { delay: keyboardTypeDelay });

  await page.click("#signupButton");

  await page.waitForSelector('.verification-token');
  await page.waitForTimeout(1000);
  await page.click("#submitButton");

  await page.waitForSelector(".dob-month");
  await page.select(".dob-month", "10");
  await page.select(".dob-day", "14");
  await page.select(".dob-year", "1983");

  await page.evaluate(() => document.querySelector("input[type='radio'][id='male']").click());

  await page.focus("#locationInput");
  await page.keyboard.type("orange", { delay: keyboardTypeDelay });
  await page.waitForSelector(".autocomplete-items");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.focus("#countryRaisedInInput");
  await page.keyboard.type("states", { delay: keyboardTypeDelay });
  await page.waitForSelector(".autocomplete-items");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.focus("#ethnicityInput");
  await page.keyboard.type("afghan", { delay: keyboardTypeDelay });
  await page.waitForSelector(".autocomplete-items");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.focus("#languageInput");
  await page.keyboard.type("english", { delay: keyboardTypeDelay });
  await page.waitForSelector(".autocomplete-items");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.focus("#languageInput");
  await page.keyboard.type("farsi", { delay: keyboardTypeDelay });
  await page.waitForSelector(".autocomplete-items");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.waitForSelector(".religious-conviction");
  await page.select(".religious-conviction", "Sunni");

  await page.waitForSelector(".religious-values");
  await page.select(".religious-values", "Conservative");

  await page.waitForSelector(".marital-status");
  await page.select(".marital-status", "Never Married");

  await page.waitForSelector(".education");
  await page.select(".education", "Bachelor's degree");

  await page.waitForSelector(".professions");
  await page.select(".professions", "Engineer");

  await page.waitForSelector(".user-height");
  await page.select(".user-height", `180`);

  await page.waitForSelector(".relocate");
  await page.select(".relocate", 'No');

  await page.waitForSelector(".diet");
  await page.select(".diet", 'Halal when possible');

  await page.evaluate(() => document.querySelector("input[type='radio'][id='smokes-no']").click());
  await page.evaluate(() => document.querySelector("input[type='radio'][id='has-children-no']").click());
  await page.evaluate(() => document.querySelector("input[type='radio'][id='wants-children-no']").click());

  await page.evaluate(() => {
    window.scrollBy(0, 1000);
  });

  await page.focus("#hobbies-input");
  await page.keyboard.type("coding", { delay: keyboardTypeDelay });
  await page.waitForSelector(".autocomplete-items");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await page.focus(".about-me");
  await page.evaluate(() => document.querySelector(`.about-me`).value = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent semper. Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus Subḥān Allāh.`);

  await page.focus(".about-my-match");
  await page.evaluate(() => document.querySelector(`.about-my-match`).value = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vivamus at augue eget arcu dictum varius. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Aliquet sagittis id consectetur purus. Urna nec tincidunt praesent semper. Tortor pretium viverra suspendisse potenti nullam ac tortor. Tellus id interdum velit laoreet. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Integer vitae justo eget magna fermentum iaculis. Mauris a diam maecenas sed enim ut. Commodo elit at imperdiet dui accumsan sit amet. Nulla facilisi cras fermentum odio eu feugiat. Vel orci porta non pulvinar neque. Eget aliquet nibh praesent tristique magna sit amet purus. Non sodales neque sodales ut etiam sit amet nisl purus Subḥān Allāh.`);

  const [fileChoose1] = await Promise.all([
    page.waitForFileChooser(),
    page.evaluate(() => document.querySelector(".image-0").click()),
  ]);

  await fileChoose1.accept(["/Users/farid/Downloads/temp/IMG_0041.jpg"]);

  await page.waitForTimeout(500);

  const [fileChoose2] = await Promise.all([
    page.waitForFileChooser(),
    page.evaluate(() => document.querySelector(".image-1").click()),
  ]);

  await fileChoose2.accept(["/Users/farid/Downloads/temp/IMG_0047.jpg"]);

  await page.waitForTimeout(500);

  const [fileChoose3] = await Promise.all([
    page.waitForFileChooser(),
    page.evaluate(() => document.querySelector(".image-2").click()),
  ]);

  await fileChoose3.accept(["/Users/farid/Downloads/temp/IMG_0048.jpg"]);

  // await page.waitForTimeout(500);

  // const [fileChoose4] = await Promise.all([
  //   page.waitForFileChooser(),
  //   page.evaluate(() => document.querySelector(".image-3").click()),
  // ]);

  // await fileChoose4.accept(["/Users/farid/Downloads/temp/IMG_0051.jpg"]);

  // await page.waitForTimeout(500);

  // const [fileChoose5] = await Promise.all([
  //   page.waitForFileChooser(),
  //   page.evaluate(() => document.querySelector(".image-4").click()),
  // ]);

  // await fileChoose5.accept(["/Users/farid/Downloads/temp/IMG_0053.jpg"]);

  // await page.waitForTimeout(500);

  // const [fileChoose6] = await Promise.all([
  //   page.waitForFileChooser(),
  //   page.evaluate(() => document.querySelector(".image-5").click()),
  // ]);

  // await fileChoose6.accept(["/Users/farid/Downloads/temp/IMG_0063.jpg"]);

  await page.waitForTimeout(1000);

  await page.click('.signup-button');

  await page.waitForSelector(`.dropdown-menu-container`);

  await client.close();
  console.log("done");

  await browser.close();
})();
