const puppeteer = require("puppeteer");
const names = require("./names");
const countries = require("../routes/world-cities");

const numberOfUsers = 10;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const allPages = await browser.pages();
  const page = allPages[0];

  await page.goto("http://localhost:3000/signup");

  const createFaridsUser = async () => {
    await page.waitForSelector("#name_id");
    await page.focus("#name_id");
    await page.keyboard.type("Farid");

    await page.focus("#email_id");
    await page.keyboard.type("farid@me.com");

    await page.focus("#password");
    await page.keyboard.type("asdfasdf");

    await page.click("button[name=signupButton]");

    await page.waitForSelector("#dob-month");
    await page.select("#dob-month", "10");
    await page.waitFor(250);
    await page.select("#dob-day", "14");
    await page.select("#dob-year", "1983");

    await page.evaluate(() =>
      document.querySelector('input[type="radio"][id="male"]').click()
    );

    await page.focus("#myInput");
    await page.waitFor(250);
    await page.keyboard.type("Orange");
    await page.waitFor(250);
    await page.waitForSelector(".autocomplete-items");
    await page.waitFor(250);
    await page.keyboard.press("ArrowDown");
    await page.waitFor(250);
    await page.keyboard.press("Enter");

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    const [fileChoose1] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector(".image-1").click()),
    ]);

    await fileChoose1.accept(["/Users/farid/Downloads/acorns.jpg"]);
    await page.waitFor(500);

    await page.waitForSelector(".signup-button");
    await page.click("button[name=createNewAccount]");
    await page.waitFor(500);

    await page.waitForSelector("#logout");
    await page.evaluate(() => document.querySelector("#logout").click());
  };

  await createFaridsUser();

  console.log("done");
  await browser.close();
})();
