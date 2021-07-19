const countriesList = require('../data/world-cities');

let countryWasCalled = false;
let countryResponse;

const countries = async (req, res) => {
  const { userInput } = req.query;
  const userInputRegex = new RegExp(userInput, 'gi');

  try {
    if (!countryWasCalled) {
      countryResponse = countriesList.default.getAllCountries();
      countryWasCalled = true;
    }

    const filteredResults = countryResponse
      .filter(element => element.country.toLowerCase().indexOf(userInput.toLowerCase()) > -1)
      .map(({ country }) => country.replace(userInputRegex, match => `<strong>${match}</strong>`));
    res.send(filteredResults);
  } catch (err) {
    return res.json({ error: err.countryResponse });
  }
};

module.exports = countries;
