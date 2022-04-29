const countriesList = require('../data/world-cities');

const countries = async (_req, res) => {
  const countries = countriesList.default.getAllCountries();
  return res.status(200).json({ countries })
};

module.exports = countries;
