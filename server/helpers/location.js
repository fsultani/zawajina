const axios = require('axios');
const locations = require('../data/world-cities');

const lowerCaseString = string => string.split(' ').join('').toLowerCase();

const location = async (req, res) => {
  const { userIPAddress } = req.query;
  const locationResponse = locations.default.getAllCities();
  const allLocations = locationResponse;

  try {
    const { data } = await axios.get(`http://ip-api.com/json/${userIPAddress}`);
    const userLocationData = data;
    const userCity = userLocationData.city;
    const userState = userLocationData.region;
    const userCountry = userLocationData.country;

    allLocations.sort((a, b) => {
      if (a.state && lowerCaseString(a.city) === lowerCaseString(userCity) && lowerCaseString(a.state) === lowerCaseString(userState)) return -1;

      if (b.city.startsWith(userCity) > a.city.startsWith(userCity)) return 1;
      if (b.city.startsWith(userCity) < a.city.startsWith(userCity)) return -1;

      if (b.country.startsWith(userCountry) > a.country.startsWith(userCountry)) return 1;
      if (b.country.startsWith(userCountry) < a.country.startsWith(userCountry)) return -1;

      if (a.state === b.state) {
        return 0;
      } else if (a.state === null) {
        return 1;
      } else if (b.state === null) {
        return -1;
      } else {
        return b.state.startsWith(userState) - a.state.startsWith(userState);
      }
    });

    res.status(200).json({
      allLocations,
      userLocationData,
    })
  } catch (err) {
    return res.json({ error: err.locationResponse });
  }
};

module.exports = location;
