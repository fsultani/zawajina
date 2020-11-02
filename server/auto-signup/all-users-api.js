// Create all users in order using api

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const names = require("./female-names");
const countries = require("../routes/world-cities");

let counter = 0;

(() => {
  const createUser = () => {
    let nameChoice;
    // Create only female users in order
    nameChoice = {
      name: names[counter],
      gender: "female",
    };

    const birthMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const birthMonth = birthMonths[Math.floor(Math.random() * birthMonths.length)];
    const birthDay = Math.floor(Math.random() * 31).toString();
    const birthYear = (1999 - Math.floor(Math.random() * 30)).toString();

    const allCities = countries.default.getAllCities();
    const randomCityIndex = Math.floor(Math.random() * allCities.length - 1);
    const randomCity = allCities[randomCityIndex];

    const data = {
      birthMonth,
      birthDay,
      birthYear,
      gender: nameChoice.gender,
      country: randomCity.country === "United States" ? "USA" : randomCity.country,
      state: randomCity.state,
      city: randomCity.city,
    };
    return {
      nameChoice,
      data,
    };
  };

  const makeApiCalls = async hasError => {
    try {
      const personalInfo = await axios.post("http://localhost:3000/register/api/personal-info", {
        name: createUser().nameChoice.name,
        email: !hasError
          ? `${createUser().nameChoice.name.toLowerCase()}@me.com`
          : `${createUser().nameChoice.name.toLowerCase()}${counter}@me.com`,
        password: "asdfasdf",
      });

      const shuffleImages = array => {
        for (let i = array.length - 1; i > 0; i--) {
          const number = Math.floor(Math.random() * (i + 1));
          [array[i], array[number]] = [array[number], array[i]];
        }
        return array;
      };

      const imagesArray = [
        "/Users/farid/Downloads/trees/butterfly-1127666__480.jpg",
        "/Users/farid/Downloads/trees/dandelion-445228__480.jpg",
        "/Users/farid/Downloads/trees/forest-931706__480.jpg",
        "/Users/farid/Downloads/trees/road-1072823__480.jpg",
        "/Users/farid/Downloads/trees/the-road-815297__480.jpg",
        "/Users/farid/Downloads/trees/tree-736885_1280.jpg",
      ];

      const formData = new FormData();
      await formData.append("userInfo", JSON.stringify(createUser().data));
      await formData.append("userId", personalInfo.data.userId);
      // await formData.append('image-1', fs.createReadStream(shuffleImages(imagesArray)[0]));
      // await formData.append('image-2', fs.createReadStream(shuffleImages(imagesArray)[1]));
      // await formData.append('image-3', fs.createReadStream(shuffleImages(imagesArray)[2]));
      // await formData.append('image-4', fs.createReadStream(shuffleImages(imagesArray)[3]));
      // await formData.append('image-5', fs.createReadStream(shuffleImages(imagesArray)[4]));
      // await formData.append('image-6', fs.createReadStream(shuffleImages(imagesArray)[5]));

      const aboutResponse = await axios.post("http://localhost:3000/register/api/about", formData, {
        headers: formData.getHeaders(),
      });
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.error(err.response.config);
        makeApiCalls(true);
      } else {
        return;
      }

      // if (counter > 0 && counter < names.length) {
      //   makeApiCalls(true);
      //   counter--;
      // }
      // if (counter === 0) {
      //   console.log('err.response:\n', err.response)
      //   return
      // };
      // --counter;
      // makeApiCalls(true);
    }

    if (counter < names.length) {
      console.log("createUser().nameChoice:\n", createUser().nameChoice);
      console.log(`counter: ${counter}/${names.length}`);
      console.log("************************************************************\n");
      counter++;
      makeApiCalls();
    } else {
      console.log(`else`);
      return;
    }
  };
  // const repeatFunction = setInterval(async () => {
  //   if (counter < names.length) {
  //     makeApiCalls();
  //   } else {
  //     clearInterval(repeatFunction);
  //   }
  // }, 500);
  makeApiCalls();
})();
