const puppeteer = require("puppeteer");
const countries = require("../data/world-cities");

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

    await page.evaluate(() => document.querySelector("input[type='radio'][id='male']").click());

    await page.focus("#myInput");
    await page.waitFor(250);
    await page.keyboard.type("Orange");
    await page.waitFor(250);
    await page.waitForSelector(".autocomplete-items");
    await page.waitFor(250);
    await page.keyboard.press("ArrowDown");
    await page.waitFor(250);
    await page.keyboard.press("Enter");

    await page.focus("#ethnicityInput");
    await page.waitFor(250);
    await page.keyboard.type("Afghan");
    await page.waitFor(250);
    await page.waitForSelector("#ethnicityResults");
    await page.waitFor(250);
    await page.keyboard.press("ArrowDown");
    await page.waitFor(250);
    await page.keyboard.press("Enter");

    await page.evaluate(() => {
      window.scrollBy(0, 100);
    });

    const [fileChoose1] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector(".image-1").click()),
    ]);

    await fileChoose1.accept(["/Users/farid/Downloads/temp/IMG_0041.jpg"]);
    await page.waitFor(250);

    const [fileChoose2] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector(".image-2").click()),
    ]);

    await fileChoose2.accept(["/Users/farid/Downloads/temp/IMG_0047.jpg"]);
    await page.waitFor(250);

    const [fileChoose3] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector(".image-3").click()),
    ]);

    await fileChoose3.accept(["/Users/farid/Downloads/temp/IMG_0048.jpg"]);
    await page.waitFor(250);

    const [fileChoose4] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector(".image-4").click()),
    ]);

    await fileChoose4.accept(["/Users/farid/Downloads/temp/IMG_0051.jpg"]);
    await page.waitFor(250);

    const [fileChoose5] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector(".image-5").click()),
    ]);

    await fileChoose5.accept(["/Users/farid/Downloads/temp/IMG_0053.jpg"]);
    await page.waitFor(250);

    const [fileChoose6] = await Promise.all([
      page.waitForFileChooser(),
      page.evaluate(() => document.querySelector(".image-6").click()),
    ]);

    await fileChoose6.accept(["/Users/farid/Downloads/temp/IMG_0063.jpg"]);
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
