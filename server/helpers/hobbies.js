const hobbiesList = require('../data/hobbies');

const hobbies = async (_req, res) => {
  const allHobbies = hobbiesList.default.getAllHobbies();
  return res.status(200).json({ allHobbies })
};

module.exports = hobbies;
