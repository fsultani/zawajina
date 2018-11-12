const express = require('express')
const { check, body, validationResult } = require('express-validator/check')
const countries = require('country-state-city')
const jwt = require('jwt-simple')
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')
const moment = require('moment')
const allNationalities = require('./nationalities')

const User = require('../models/user')

const router = express.Router()

router.post('/api/personal-info', [
  check('userRegistrationForm.name').not().isEmpty().withMessage('Enter your name'),
  check('userRegistrationForm.email').isEmail().withMessage('Enter a valid email address'),
  check('userRegistrationForm.password').not().isEmpty().withMessage('Enter a password'),
  ], (req, res) => {
  const name = req.body.userRegistrationForm.name
  const email = req.body.userRegistrationForm.email
  const password = req.body.userRegistrationForm.password

  const getErrors = validationResult(req)
  if (!getErrors.isEmpty()) {
    return res.status(400).json({ error: getErrors.array() })
  } else {
    User.findOne({ email }, (err, userExists) => {
      if (!userExists) {
        const newUser = new User ({
          name,
          email,
          password,
          gender: null,
          age: null,
          country: null,
          state: null,
          city: null,
          ethnicity: null,
        })

        User.createUser(newUser, (err, user) => {
          const token = jwt.encode({ email: user.email }, JWT_SECRET)
          const userId = user.id
          res.status(201).send({ userId })
        })
      } else if (userExists.email) {
        res.json({ error: "Email already exists"})
      } else {
        res.json({ error: "Unknown error" })
      }
    })
  }
})

router.get('/api/all-countries', (req, res) => {
  const countryList = countries.getAllCountries()
  res.send(countryList)
})

router.get('/api/state-list', (req, res) => {
  const stateList = countries.getStatesOfCountry(req.query.country)
  res.send(stateList)
})

router.get('/api/city-list', (req, res) => {
  const cityList = countries.getCitiesOfState(req.query.city)
  res.send(cityList)
})

router.get('/api/nationalities', (req, res) => {
  res.send(allNationalities.getNationality(req.query.name))
})

router.post('/api/about', (req, res) => {
  const {
    usersInfo,
    userId
  } = req.body.data
  const {
    gender,
    birthMonth,
    birthDate,
    birthYear,
    countrySelection,
    stateSelection,
    citySelection,
    ethnicity 
  } = usersInfo

  const dobMonth = moment().month(birthMonth).format('MM')
  const dobDate = moment().date(birthDate).format('DD')
  const fullDob = `${birthYear}-${dobMonth}-${dobDate}`
  const usersDob = moment().diff(fullDob, 'years')

  let stateSelected;
  let citySelected;

  const countrySelected = countries.getAllCountries()
    .filter(country => country.name === countrySelection ? countrySelection : null)

  // For U.S. states
  if (countrySelected.length === 1 && countrySelected[0].id === '231') {
    stateSelected = countries.getStatesOfCountry(231)
      .filter(state => state.name === stateSelection ? stateSelection : null)

    citySelected = countries.getCitiesOfState(stateSelected[0].id)
      .filter(city => city.name === citySelection ? citySelection : null)
  } else if (countrySelected.length === 1 && countrySelected[0].id !== '231') {
    // For non U.S. cities
    stateSelected = null
    citySelected = countries.getStatesOfCountry(countrySelected[0].id)
      .filter(city => city.name === citySelection ? citySelection : null)
  }

  const usersCountry = countrySelected.length === 1 ? countrySelected[0].name : null
  const usersState = stateSelected && stateSelected.length === 1 ? stateSelected[0].name : null
  const usersCity = citySelected.length === 1 ? citySelected[0].name : null

  User.update({ _id: userId }, {
    $set: {
      gender,
      age: usersDob,
      country: usersCountry,
      state: usersState,
      city: usersCity,
      ethnicity,
    }
  }, (err, userFound) => {
    if (err) {
      res.send({error: err})
    } else {
      res.status(201).send(userId)
    }
  })
})

module.exports = router
