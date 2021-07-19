const languagesList = require('../data/languages');

let languagesWasCalled = false;
let languagesResponse;

const languages = async (req, res) => {
  const { userInput } = req.query;
  const userInputRegex = new RegExp(userInput, 'gi');

  try {
    if (!languagesWasCalled) {
      languagesResponse = languagesList.default.getAllLanguages();
      languagesWasCalled = true;
    }

    const filteredResults = languagesResponse.filter(
      element => element.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    filteredResults.sort((a, b) => b < a);
    res.send(filteredResults);
  } catch (err) {
    return res.json({ error: err.languagesResponse });
  }
};

module.exports = languages;
