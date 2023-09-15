const express = require('express');
const { ObjectId } = require('mongodb');
const { getAllFiles } = require('../utils');
const { usersCollection } = require('../db.js');
const locations = require('../data/world-cities');
const unitedStates = locations.default.getAllUnitedStates();

const router = express.Router();

router.get('/', (req, res) => {
  const { authUser, allConversationsCount } = req;

  const directoryPath = ['client/views/app/search'];

  const stylesArray = [
    '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
    '/static/client/views/app/_partials/app-nav.css',
  ];

  const scriptsArray = [
    '/static/assets/apis/axios.min.js',
    '/static/assets/apis/js.cookie.min.js',
  ];

  const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
  const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

  res.render('app/_layouts/index', {
    locals: {
      title: 'Zawajina',
      styles,
      scripts,
      authUser,
      allConversationsCount,
    },
    partials: {
      nav: 'app/_partials/app-nav',
      body: 'app/search/index',
    },
  });
});

router.get('/api/user-data', (req, res) => {
  const { authUser } = req;

  const locations = authUser.searchOptions.data.$or?.map(location => {
    const city = location.city.$exists ? 'null' : location.city;

    let state = location.state.$exists ? 'null' : location.state;
    if (location.city.$exists && location.state.length === 2) {
      state = unitedStates.find(item => item.abbreviation === location.state).name;
    }

    const country = location.country;

    return {
      city,
      state,
      country,
    }
  }) ?? [];

  const searchOptionsIn = [
    'languages',
    'profession',
    'hobbies',
    'maritalStatus',
    'religiousConviction',
    'religiousValues',
    'education',
    'diet',
    'prayerLevel',
  ];

  const searchData = [
    'hasChildren',
    'wantsChildren',
    'hijab',
    'smokes',
    'age',
    'height', 
    'photos', 
  ];

  const searchOptionsList = searchOptionsIn.map(option => ({
    [option]: authUser.searchOptions.data[option]?.$in ?? [],
  }))

  const searchDataList = searchData.map(option => ({
    [option]: authUser.searchOptions.data[option],
  }))

  let searchOptionsObject = {};
  for (const option of [...searchOptionsList, ...searchDataList]) {
    Object.assign(searchOptionsObject, option)
  }

  const { sortResults } = authUser.searchOptions;

  const searchOptions = {
    locations,
    ...searchOptionsObject,
    sortResults,
  }

  res.status(200).send({ searchOptions });
})

router.put('/api', async (req, res) => {
  try {
    const { authUser } = req;

    const {
      locations,
      languages,
      profession,
      hobbies,
      maritalStatus,
      religiousConviction,
      religiousValues,
      education,
      hasChildren,
      wantsChildren,
      hijab,
      diet,
      smokes,
      ethnicity,
      age,
      height,
      prayerLevel,
      sortResults,
      showPhotosOnly,
    } = req.body;

    const blockedUsers = authUser.blockedUsers;

    let searchOptions = {
      _id: {
        $nin: blockedUsers,
      },
      gender: authUser.gender === 'male' ? 'female' : 'male',
      '_account.user.accountStatus': 'active',
      '_account.admin.accountStatus': 'approved',
      languages: { $in: languages },
      profession: { $in: profession },
      hobbies: { $in: hobbies },
      maritalStatus: { $in: maritalStatus },
      religiousConviction: { $in: religiousConviction },
      religiousValues: { $in: religiousValues },
      education: { $in: education },
      hasChildren,
      wantsChildren,
      hijab,
      smokes,
      ethnicity: { $in: ethnicity },
      diet: { $in: diet },
      age: {
        $exists: true,
      },
      height: {
        $gte: Number(height.minHeightValue),
        $lte: Number(height.maxHeightValue),
      },
      prayerLevel: { $in: prayerLevel },
      photos: showPhotosOnly,
    };

    let locationsList = [];
    if (locations.length > 0) {
      locationsList = locations.map(location => {
        const city = location.city === 'null' ? { $exists: true } : location.city;

        let state = location.state === 'null' ? { $exists: true } : location.state;
        if (city.$exists && location.state.length > 2) {
          state = location.state === 'null' ? { $exists: true } : unitedStates.find(item => item.name === location.state).abbreviation;
        }

        const country = location.country;

        return {
          city,
          state,
          country,
        }
      })

      searchOptions = {
        ...searchOptions,
        $or: [...locationsList],
      }
    }

    if (Number(age.minAgeValue) !== 18 || Number(age.maxAgeValue) !== 60) {
      searchOptions = {
        ...searchOptions,
        age: {
          $gte: Number(age.minAgeValue),
          $lte: Number(age.maxAgeValue)
        },
      }
    }

    if (sortResults === 'nearestToYou') {
      const coordinates = authUser.geolocationCoordinates;

      searchOptions = {
        ...searchOptions,
        geolocationCoordinates: {
          $near: {
            $geometry: { type: "Point", coordinates },
          }
        }
      }
    } else if (sortResults !== 'nearestToYou') {
      delete searchOptions.geolocationCoordinates;
    }

    searchOptions = {
      data: { ...searchOptions },
      sortResults,
    }

    const userId = authUser._id;
    await usersCollection().findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        $set: {
          searchOptions,
        },
      },
      {
        returnDocument: 'after',
        returnNewDocument: true,
      }
    )

    res.status(201).send({ url: '/users' });
  } catch (error) {
    console.log(`error - server/routes/search.js:380\n`, error);
  }
});

module.exports = router;
