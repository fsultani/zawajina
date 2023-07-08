const countriesList = require('../data/world-cities');

const countries = async (_req, res) => {
  const allCountries = countriesList.default.getAllCountries();
  return res.status(200).json({ allCountries })
};

module.exports = countries;
