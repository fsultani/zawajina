// Create fixed number of random users using api

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const names = require("./female-names");
// const names = require('./male-names');
const countries = require("../data/world-cities");
const ethnicities = require("../data/ethnicities");

const numberOfUsers = 100;
let counter = 1;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const createUser = () => {
  let nameChoice;
  // Create only female users at random
  nameChoice = {
    name: names[Math.floor(Math.random() * names.length)],
    gender: "female",
  };

  // Create only male users at random
  // nameChoice = {
  //   name: names[Math.floor(Math.random() * names.length)],
  //   gender: 'male',
  // };

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

        const formData = new FormData();
        formData.append("userInfo", JSON.stringify(createUser().data));
        formData.append("userId", res.data.userId);

        axios
          .post("http://localhost:3000/register/api/profile-details", formData, {
            maxBodyLength: Infinity,
            headers: formData.getHeaders(),
          })
          .then(res => {
            console.log("api/profile-details status:\n", res.status);
            console.log("res.data:\n", res.data);
            console.log(`${counter} of ${numberOfUsers}\n`);
            if (counter < numberOfUsers) {
              counter += 1;
              sleep(500);
              return makeApiCalls();
            }
            return;
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
      sleep(500);
      return makeApiCalls();
    });
};

makeApiCalls();
