const languagesList = require('../data/languages');

const languages = async (_req, res) => {
  const allLanguages = languagesList.default.getAllLanguages();
  console.log(`allLanguages successfully loaded`);
  return res.status(200).json({ allLanguages });
};

module.exports = languages;
