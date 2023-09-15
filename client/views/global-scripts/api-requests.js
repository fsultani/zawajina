const locationData = async () => {
  try {
    const data = await Axios({
      apiUrl: '/api/register/location', // server/routes/register/index.js
    });

    return data;
  } catch (error) {
    return error.response;
  }
};

const getAllCountries = async () => {
  try {
    const data = await Axios({
      apiUrl: '/api/register/countries', // server/routes/register/index.js
    });

    return data;
  } catch (error) {
    return error.response;
  }
};

const getAllEthnicities = async () => {
  try {
    const data = await Axios({
      apiUrl: '/api/register/ethnicities', // server/routes/register/index.js
    });

    return data;
  } catch (error) {
    return error.response;
  }
};

const getAllLanguages = async () => {
  try {
    const data = await Axios({
      apiUrl: '/api/register/languages', // server/routes/register/index.js
    });

    return data;
  } catch (error) {
    return error.response;
  }
};

const getAllHobbies = async () => {
  try {
    const data = await Axios({
      apiUrl: '/api/register/hobbies', // server/routes/register/index.js
    });

    return data;
  } catch (error) {
    return error.response;
  }
};
