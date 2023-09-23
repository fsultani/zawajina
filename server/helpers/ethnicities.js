const ethnicitiesList = require('../data/ethnicities');

const ethnicities = async (_req, res) => {
  const allEthnicities = ethnicitiesList.default.getAllEthnicities();
  console.log(`allEthnicities successfully loaded`);
  return res.status(200).json({ allEthnicities });
};

module.exports = ethnicities;
