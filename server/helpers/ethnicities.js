const ethnicitiesList = require('../data/ethnicities');

let ethnicityWasCalled = false;
let ethnicityResponse;

const ethnicities = async (req, res) => {
  const { userInput } = req.query;
  const userInputRegex = new RegExp(userInput, 'gi');

  try {
    if (!ethnicityWasCalled) {
      ethnicityResponse = ethnicitiesList.default.getAllEthnicities();
      ethnicityWasCalled = true;
    }

    const filteredResults = ethnicityResponse.filter(
      element => element.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    filteredResults.sort((a, b) => b < a);
    res.send(filteredResults);
  } catch (err) {
    return res.json({ error: err.ethnicityResponse });
  }
};

module.exports = ethnicities;
