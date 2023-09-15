const axios = require('axios');
const { checkIPAddress } = require('../middleware/checkAuthentication');

const { getAllCities, getAllUnitedStates } = require('../data/world-cities').default;
const { returnServerError } = require('../utils');

const lowerCaseString = string => string?.split(' ').join('').toLowerCase();

const location = async (req, res) => {
  try {
    const { userIPAddress } = await checkIPAddress(req);
    const allCities = getAllCities();
    const unitedStates = getAllUnitedStates();
    const allLocations = allCities;

    const { data } = process.env.NODE_ENV === 'development' ? {
      data: {
        status: 'success',
        country: 'United States',
        countryCode: 'US',
        region: 'CA',
        regionName: 'California',
        city: 'Orange',
        zip: '92869',
        lat: 33.7854,
        lon: -117.7948,
        timezone: 'America/Los_Angeles',
        isp: 'Charter Communications',
        org: 'Spectrum',
        as: 'AS20001 Charter Communications Inc',
        query: '98.148.238.157'
      }
    } : await axios.get(`http://ip-api.com/json/${userIPAddress}`);

    const userLocationData = data;
    const userCity = userLocationData.city;
    const userState = userLocationData.region;
    const userCountry = userLocationData.country;

    allLocations.sort((a, b) => {
      console.log(`lowerCaseString(a.city) - server/helpers/location.js:40\n`, lowerCaseString(a.city));
      if (a.state && lowerCaseString(a.city) === lowerCaseString(userCity) && lowerCaseString(a.state) === lowerCaseString(userState)) return -1;

      if (b.city?.startsWith(userCity) > a.city?.startsWith(userCity)) return 1;
      if (b.city?.startsWith(userCity) < a.city?.startsWith(userCity)) return -1;

      if (b.country?.startsWith(userCountry) > a.country?.startsWith(userCountry)) return 1;
      if (b.country?.startsWith(userCountry) < a.country?.startsWith(userCountry)) return -1;

      if (a.state === b.state) {
        return 0;
      } else if (a.state === null) {
        return 1;
      } else if (b.state === null) {
        return -1;
      } else {
        return b.state?.startsWith(userState) - a.state?.startsWith(userState);
      }
    });

    res.status(200).send({
      allLocations,
      allCities,
      unitedStates,
      userLocationData,
    })
  } catch (error) {
    returnServerError(res, error);
  }
};

module.exports = location;
