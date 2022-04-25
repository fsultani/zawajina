const axios = require('axios');

const locations = require('../data/world-cities');

let locationApiWasCalled = false;
let userLocationData;
let userCity;
let userState;
let userCountry;

let allCountries;
let allUnitedStates;
let allCities;

const lowerCaseString = string => string.split(' ').join('').toLowerCase();

const search = async (req, res) => {
  const { userIPAddress, userInput } = req.query;
  const allResults = [];

  allCountries = locations.default.getAllCountries();
  allUnitedStates = locations.default.getAllUnitedStates();
  allCities = locations.default.getAllCities();

  const countries = allCountries.filter(location => {
    return lowerCaseString(location.country).startsWith(lowerCaseString(userInput));
  });

  const unitedStates = allUnitedStates.filter(location => {
    return lowerCaseString(location.name).startsWith(lowerCaseString(userInput));
  });

  const cities = allCities.filter(element => {
    const hasComma = userInput.indexOf(',') > -1;
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

  try {
    if (!locationApiWasCalled) {
      userLocationData = await axios.get(`http://ip-api.com/json/${userIPAddress}`);
      userCity = userLocationData.data.city;
      userState = userLocationData.data.region;
      userCountry = userLocationData.data.country;
      locationApiWasCalled = true;
    }

    if (countries.length > 0) {
      for (let i = 0; i < countries.length; i++) {
        const country = countries[i].country;
        const fullLocation = country;

        if (fullLocation.substr(0, userInput.length).toUpperCase() == userInput.toUpperCase()) {
          const search = new RegExp(userInput, 'gi');
          const match = fullLocation.replace(search, match => `<strong>${match}</strong>`);
          allResults.push({
            match,
            country,
          });
        }
      }
    }

    if (unitedStates.length > 0) {
      for (let i = 0; i < unitedStates.length; i++) {
        const state = unitedStates[i].name;
        const fullLocation = state;

        if (fullLocation.substr(0, userInput.length).toUpperCase() == userInput.toUpperCase()) {
          const search = new RegExp(userInput, 'gi');
          const match = fullLocation.replace(search, match => `<strong>${match}</strong>`);
          allResults.push({
            match,
            state,
            country: 'USA',
          });
        }
      }
    }

    if (cities.length > 0) {
      cities.sort((a, b) => {
        if (a.state && lowerCaseString(a.city) === lowerCaseString(userCity) && lowerCaseString(a.state) === lowerCaseString(userState)) return -1;

        if (b.city.startsWith(userCity) < a.city.startsWith(userCity)) return -1;
        if (b.city.startsWith(userCity) > a.city.startsWith(userCity)) return 1;

        if (b.country.startsWith(userCountry) < a.country.startsWith(userCountry)) return -1;
        if (b.country.startsWith(userCountry) > a.country.startsWith(userCountry)) return 1;

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

      for (let i = 0; i < cities.length; i++) {
        const country = cities[i].country;
        const fullLocation = `${cities[i].city}, ${cities[i].state ? `${cities[i].state}, ${country}` : country
          }`;

        if (fullLocation.substr(0, userInput.length).toUpperCase() == userInput.toUpperCase()) {
          const search = new RegExp(userInput, 'gi');
          const match = fullLocation.replace(search, match => `<strong>${match}</strong>`);
          allResults.push({
            match,
            city: cities[i].city,
            state: cities[i].state,
            country,
          });
        }
      }
    }

    const results = allResults.slice(0, 7);
    res.send(results);
  } catch (err) {
    return res.json({ error: 'Error in search API' });
  }
};

module.exports = search;
