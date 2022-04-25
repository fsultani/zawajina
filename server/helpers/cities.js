const axios = require('axios');

const locations = require('../data/world-cities');

let locationDataWasCalled = false;
let userLocationData;
let userCity;
let userState;
let userCountry;
let locationResponse;

const lowerCaseString = string => string.split(' ').join('').toLowerCase();

const cities = async (req, res) => {
  const { userIPAddress, userInput } = req.query;
  const allResults = [];

  try {
    if (!locationDataWasCalled) {
      userLocationData = await axios.get(`http://ip-api.com/json/${userIPAddress}`);
      userCity = userLocationData.data.city;
      userState = userLocationData.data.region;
      userCountry = userLocationData.data.country;
      locationResponse = locations.default.getAllCities();
      locationDataWasCalled = true;
    }

    const filteredResults = locationResponse.filter(element => {
      const hasComma = userInput.indexOf(',') !== -1;
      if (hasComma) {
        if (element.state) {
          return element.state
            .toLowerCase()
            .startsWith(userInput.split(',')[1].toLowerCase().trim());
        } else {
          return element.country
            .toLowerCase()
            .startsWith(userInput.split(',')[1].toLowerCase().trim());
        }
      } else {
        return element.city.toLowerCase().startsWith(userInput.toLowerCase());
      }
    });

    filteredResults.sort((a, b) => {
      if (a.state && lowerCaseString(a.city) === lowerCaseString(userCity) && lowerCaseString(a.state) === lowerCaseString(userState)) return -1;

      if (b.city.startsWith(userCity) > a.city.startsWith(userCity)) return 1;
      if (b.city.startsWith(userCity) < a.city.startsWith(userCity)) return -1;

      if (b.country.startsWith(userCountry) > a.country.startsWith(userCountry)) return 1;
      if (b.country.startsWith(userCountry) < a.country.startsWith(userCountry)) return -1;

      if (a.state === b.state) {
        return 0;
      } else if (a.state === null) {
        return 1;
      } else if (b.state === null) {
        return -1;
      } else {
        return b.state.startsWith(userState) - a.state.startsWith(userState);
      }
    });

    for (let i = 0; i < filteredResults.length; i++) {
      const country = filteredResults[i].country;
      const fullLocation = `${filteredResults[i].city}, ${
        filteredResults[i].state ? `${filteredResults[i].state}, ${country}` : country
      }`;

      if (fullLocation.substr(0, userInput.length).toUpperCase() == userInput.toUpperCase()) {
        const search = new RegExp(userInput, 'gi');
        const match = fullLocation.replace(search, match => `<strong>${match}</strong>`);
        allResults.push({
          match,
          city: filteredResults[i].city,
          state: filteredResults[i].state,
          country: country,
        });
      }
    }

    const results = allResults.slice(0, 7);
    res.send(results);
  } catch (err) {
    return res.json({ error: err.locationResponse });
  }
};

module.exports = cities;
