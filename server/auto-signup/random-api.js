// Create fixed number of random users using api

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const names = require("./female-names");
const countries = require("../data/world-cities");
const ethnicities = require("../data/ethnicities");

const numberOfUsers = 1;
let counter = 1;

const createUser = () => {
  let nameChoice;
  // Create only female users at random
  nameChoice = {
    name: names[Math.floor(Math.random() * names.length)],
    gender: "female",
  };

  const birthMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const birthMonth = birthMonths[Math.floor(Math.random() * birthMonths.length)];
  const birthDay = Math.floor(Math.random() * 31).toString();
  const birthYear = (1999 - Math.floor(Math.random() * 30)).toString();

  const allCities = countries.default.getAllCities();
  const randomCityIndex = Math.floor(Math.random() * allCities.length - 1);
  const randomCity = allCities[randomCityIndex];
  const allEthnicities = ethnicities.default.getAllEthnicities();
  const randomEthnicity = Math.floor(Math.random() * allEthnicities.length - 1);
  const ethnicity = allEthnicities[randomEthnicity];

  const data = {
    birthMonth,
    birthDay,
    birthYear,
    gender: nameChoice.gender,
    country: randomCity.country === "United States" ? "USA" : randomCity.country,
    state: randomCity.state,
    city: randomCity.city,
    ethnicity,
  };
  return {
    nameChoice,
    data,
  };
};

const makeApiCalls = () => {
  return axios
    .post("http://localhost:3000/register/api/personal-info", {
      name: createUser().nameChoice.name,
      email: `${createUser().nameChoice.name.toLowerCase()}@me.com`,
      password: "asdfasdf",
    })
    .then(res => {
      if (res.status === 201) {
        console.log("api/personal-info status:\n", res.status);
        console.log("res.config.data:\n", res.config.data);

        const imagesArray = [
          "/Users/farid/Downloads/temp/IMG_0041.jpg",
          "/Users/farid/Downloads/temp/IMG_0047.jpg",
          "/Users/farid/Downloads/temp/IMG_0048.jpg",
          "/Users/farid/Downloads/temp/IMG_0051.jpg",
          "/Users/farid/Downloads/temp/IMG_0053.jpg",
          "/Users/farid/Downloads/temp/IMG_0063.jpg",
        ];

        const formData = new FormData();
        formData.append("userInfo", JSON.stringify(createUser().data));
        formData.append("userId", res.data.userId);

        const images = Array(imagesArray.length)
          .fill()
          .map((_, index) => index + 1);
        images.sort(() => Math.random() - 0.5);

        // for (let i = 0; i < imagesArray.length; i++) {
        //   formData.append(`image-${i + 1}`, fs.createReadStream(imagesArray[i]));
        // }
        formData.append(
          `image-1`,
          fs.createReadStream(imagesArray[Math.floor(Math.random() * imagesArray.length)])
        );

        axios
          .post("http://localhost:3000/register/api/about", formData, {
            maxBodyLength: Infinity,
            headers: formData.getHeaders(),
          })
          .then(res => {
            console.log("api/about status:\n", res.status);
            console.log("res.data:\n", res.data);
            console.log(`${counter} of ${numberOfUsers}\n`);
            // return makeApiCalls();
            if (counter < numberOfUsers) {
              counter += 1;
              return makeApiCalls();
            } else {
              return;
            }
            // return;
          })
          .catch(error => {
            console.log("error.message:\n", error.message);
            return;
          });
      } else {
        console.log(`else`);
      }
    })
    .catch(error => {
      console.log("error.message:\n", error.message);
      return makeApiCalls();
    });
};

makeApiCalls();
