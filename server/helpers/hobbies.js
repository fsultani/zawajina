const hobbiesList = require('../data/hobbies');

let hobbyWasCalled = false;
let hobbyResponse;

const hobbies = async (req, res) => {
  const { userInput } = req.query;
  const userInputRegex = new RegExp(userInput, 'gi');

  try {
    if (!hobbyWasCalled) {
      hobbyResponse = hobbiesList.default.getAllHobbies();
      hobbyWasCalled = true;
    }

    const filteredResults = hobbyResponse.filter(
      element => element.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    filteredResults.sort((a, b) => b < a);
    res.send(filteredResults);
  } catch (err) {
    return res.json({ error: err.hobbyResponse });
  }
};

module.exports = hobbies;
