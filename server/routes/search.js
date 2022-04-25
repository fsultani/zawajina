const express = require('express');
const { getAllFiles } = require('../utils');

const { usersCollection } = require('../db.js');
const search = require('../helpers/search');
const worldCities = require('../data/world-cities');

const router = express.Router();

router.get('/', async (req, res) => {
  const { authUser, allConversationsCount } = req;

  const stylesDirectoryPath = ['client/views/app/search'];
  const scriptsDirectoryPath = ['client/views/app/search/js', 'client/views/app/search/js/helpers'];

  const styles = [
    '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
    '/static/client/views/app/_partials/app-nav.css',
    '/static/client/views/app/_layouts/app-global-styles.css',
  ];

  const scripts = [
    '/static/assets/apis/axios.min.js',
    '/static/assets/apis/js.cookie.min.js',
  ];

  res.render('app/_layouts/index', {
    locals: {
      title: 'My Match',
      styles: getAllFiles({ directoryPath: stylesDirectoryPath, fileType: 'css', filesArray: styles }),
      scripts: getAllFiles({ directoryPath: scriptsDirectoryPath, fileType: 'js', filesArray: scripts }),
      authUser,
      allConversationsCount,
    },
    partials: {
      nav: 'app/_partials/app-nav',
      body: 'app/search/index',
    },
  });
});

router.get('/api', (req, res) => search(req, res));

router.get('/results', async (req, res) => {
  const { authUser, allConversationsCount } = req;
  const {
    locations,
    ethnicity,
    minAgeValue,
    maxAgeValue,
    maritalStatus,
    religiousConviction,
    education,
    minHeight,
    maxHeight,
    hijab,
    religiousValues,
    showPhotosOnly,
    sortResults,
  } = req.query;

  const countryAbbreviations = {
    'United States': {
      name: 'USA',
    },
    'United Arab Emirates': {
      name: 'UAE'
    }
  };

  let searchQuery = {
    gender: authUser.gender === 'male' ? 'female' : 'male',
    age: {
      $gte: Number(minAgeValue),
      $lte: Number(maxAgeValue)
    },
    height: {
      $gte: Number(minHeight),
      $lte: Number(maxHeight)
    },
  };

  let locationsArray = [];
  let locationsList = [];
  if (locations) {
    const allUnitedStates = worldCities.default.getAllUnitedStates();
    locationsArray = new Array(locations).flat();
    locationsList = locationsArray.map(location => {
      const jsonLocation = JSON.parse(location);
      const city = jsonLocation.city === 'null' ? { $exists: true } : jsonLocation.city;

      let state = { $exists: true };
      if (jsonLocation.state !== 'null') {
        if (jsonLocation.city === 'null') {
          const stateData = allUnitedStates.find(state => state.name === jsonLocation.state);
          state = stateData.abbreviation;
        } else {
          state = jsonLocation.state;
        }
      }

      let country = jsonLocation.country;
      if (countryAbbreviations.hasOwnProperty(jsonLocation.country)) {
        country = countryAbbreviations[jsonLocation.country].name;
      }

      return {
        city,
        state,
        country,
      }
    });
  
    searchQuery = {
      ...searchQuery,
      $or: [...locationsList],
    }
  }

  if (ethnicity) {
    searchQuery = {
      ...searchQuery,
      ethnicity: { $all: [ethnicity].flat() },
    }
  };

  if (maritalStatus) {
    searchQuery = {
      ...searchQuery,
      maritalStatus,
    }
  };

  if (religiousConviction) {
    searchQuery = {
      ...searchQuery,
      religiousConviction,
    }
  };

  if (education) {
    searchQuery = {
      ...searchQuery,
      education,
    }
  };

  if (hijab) {
    searchQuery = {
      ...searchQuery,
      hijab,
    }
  };

  if (religiousValues) {
    searchQuery = {
      ...searchQuery,
      religiousValues,
    }
  };

  if (showPhotosOnly) {
    searchQuery = {
      ...searchQuery,
      photos: { $exists: true, $ne: [] },
    }
  };

  if (sortResults === 'nearestToYou') {
    searchQuery = {
      ...searchQuery,
      location:
      {
        $near:
        {
          $geometry: { type: "Point", coordinates: [...authUser.location.coordinates] },
        }
      }
    }
  }

  const sortResultsDictionary = {
    'lastActive': {
      'loginData.time': -1
    },
    'newestMembers': {
      completedRegistrationAt: -1,
    },
    'nearestToYou': {},
  };

  try {
    console.log(`searchQuery\n`, searchQuery);
    const page = parseInt(req.query.page);
    const skipRecords = page > 1 ? (page - 1) * 20 : 0;

    const allUsersCount = await usersCollection()
      .find(searchQuery)
      .count();

    const allUsers = await usersCollection()
      .find(searchQuery)
      .sort(sortResultsDictionary[sortResults])
      .skip(skipRecords)
      .limit(20)
      .toArray();

    const numberOfPages = Math.ceil(allUsersCount / 20);
    const currentPage = page || 1;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < numberOfPages ? currentPage + 1 : null;

    const styles = [
      '/static/client/views/app/_partials/app-nav.css',
      '/static/client/views/app/_layouts/app-global-styles.css',
    ];

    const scripts = [
      '/static/assets/apis/axios.min.js',
      '/static/assets/apis/js.cookie.min.js',
    ];

    if (currentPage <= numberOfPages) {
      res.render('app/_layouts/index', {
        locals: {
          title: 'My Match',
          styles: getAllFiles({ directoryPath: ['client/views/app/searchResults'], fileType: 'css', filesArray: styles }),
          scripts: getAllFiles({ directoryPath: ['client/views/app/searchResults'], fileType: 'js', filesArray: scripts }),
          authUser,
          allConversationsCount,
          allUsersCount,
          allUsers,
          previousPage,
          numberOfPages,
          currentPage,
          nextPage,
        },
        partials: {
          nav: 'app/_partials/app-nav',
          body: 'app/searchResults/index',
        },
      });
    } else if (numberOfPages === 0) {
      res.render('app/_layouts/index', {
        locals: {
          title: 'My Match',
          styles: [
            '/static/client/views/app/searchResults/styles.css',
            '/static/client/views/app/_partials/app-nav.css',
            '/static/client/views/app/_layouts/app-global-styles.css',
          ],
          scripts: [
            '/static/assets/apis/axios.min.js',
            '/static/assets/apis/js.cookie.min.js',
          ],
          authUser,
          allConversationsCount,
          allUsersCount: 0,
          allUsers: [],
          previousPage: 0,
          numberOfPages: 1,
          currentPage: 1,
          nextPage,
        },
        partials: {
          nav: 'app/_partials/app-nav',
          body: 'app/searchResults/index',
        },
      });
    } else {
      res.redirect(`/users?page=${numberOfPages}`);
    }
  } catch (error) {
    console.log(`error\n`, error);
  }
});

module.exports = router;
