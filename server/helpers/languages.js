const languagesList = require('../data/languages');

const languages = async (_req, res) => {
  const allLanguages = languagesList.default.getAllLanguages();
  return res.status(200).json({ allLanguages });
};

module.exports = languages;
