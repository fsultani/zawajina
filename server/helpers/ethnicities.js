const ethnicitiesList = require('../data/ethnicities');

const ethnicities = async (_req, res) => {
  const allEthnicities = ethnicitiesList.default.getAllEthnicities();
  return res.status(200).json({ allEthnicities });
};

module.exports = ethnicities;
