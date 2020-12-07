// Create fixed number of random users using api

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const names = require('./female-names');
const countries = require('../routes/world-cities');
const ethnicities = require('../routes/ethnicities');

const numberOfUsers = 1;
let counter = 0;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const createUser = () => {
  let nameChoice;
  // Create only female users at random
  nameChoice = {
    name: names[Math.floor(Math.random() * names.length)],
    gender: 'female',
  };

  const birthMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const birthMonth = birthMonths[Math.floor(Math.random() * birthMonths.length)];
  const birthDay = Math.floor(Math.random() * 31).toString();
  const birthYear = (1999 - Math.floor(Math.random() * 30)).toString();

  const allCities = countries.default.getAllCities();
  const randomCityIndex = Math.floor(Math.random() * allCities.length - 1);
  const randomCity = allCities[randomCityIndex];
  const allEthnicities = ethnicities.default.getAllEthnicities();
  const randomEthnicity = Math.floor(Math.random() * allEthnicities.length - 1);
  const ethnicity = allEthnicities[randomEthnicity]

  const data = {
    birthMonth,
    birthDay,
    birthYear,
    gender: nameChoice.gender,
    country: randomCity.country === 'United States' ? 'USA' : randomCity.country,
    state: randomCity.state,
    city: randomCity.city,
    ethnicity,
  };
  return {
    nameChoice,
    data,
  };
};

const makeApiCalls = async () => {
  axios.post('http://localhost:3000/register/api/personal-info', {
    name: createUser().nameChoice.name,
    email: `${createUser().nameChoice.name.toLowerCase()}@me.com`,
    password: 'asdfasdf',
  }).then(res => {
    console.log('createUser().nameChoice:\n', createUser().nameChoice);

    const shuffleImages = array => {
      for (let i = array.length - 1; i > 0; i--) {
        const number = Math.floor(Math.random() * (i + 1));
        [array[i], array[number]] = [array[number], array[i]];
      }
      return array;
    };

    const imagesArray = [
      '/Users/farid/Downloads/trees/butterfly-1127666__480.jpg',
      '/Users/farid/Downloads/trees/dandelion-445228__480.jpg',
      '/Users/farid/Downloads/trees/forest-931706__480.jpg',
      '/Users/farid/Downloads/trees/road-1072823__480.jpg',
      '/Users/farid/Downloads/trees/the-road-815297__480.jpg',
      '/Users/farid/Downloads/trees/tree-736885_1280.jpg',
    ];

    const formData = new FormData();
    formData.append('userInfo', JSON.stringify(createUser().data));
    formData.append('userId', res.data.userId);
    formData.append('image-1', fs.createReadStream(shuffleImages(imagesArray)[0]));
    formData.append('image-2', fs.createReadStream(shuffleImages(imagesArray)[1]));
    formData.append('image-3', fs.createReadStream(shuffleImages(imagesArray)[2]));
    formData.append('image-4', fs.createReadStream(shuffleImages(imagesArray)[3]));
    formData.append('image-5', fs.createReadStream(shuffleImages(imagesArray)[4]));
    formData.append('image-6', fs.createReadStream(shuffleImages(imagesArray)[5]));

    if (res.status === 201) {
      axios.post('http://localhost:3000/register/api/about', formData, {
        headers: formData.getHeaders(),
      }).then(res => {
        console.log('res.status:\n', res.status);
        counter++;
        if (res.status === 201 && counter < numberOfUsers) {
          sleep(2000);
          makeApiCalls();
        } else {
          return;
        }
      }).catch(error => {
        console.log('error:\n', error);
        return;
      })
    }
  }).catch(err => {
    console.log('err:\n', err);
    return;
  })
  // console.log(`counter: ${counter}/${numberOfUsers}`);
  // console.log('************************************************************\n');
};

makeApiCalls();
