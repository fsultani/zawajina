const express = require('express')
const { check, body, validationResult } = require('express-validator/check')
const countries = require('country-state-city')
const jwt = require('jwt-simple')
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

const User = require('../models/user')

const router = express.Router()

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

router.post('/api/about', (req, res) => {
  const { countrySelection, stateSelection, citySelection, userId } = req.body.data

  let stateSelected;
  let citySelected;

  const countrySelected = countries.getAllCountries()
    .filter(country => country.name === countrySelection ? countrySelection : null)

  // For U.S. states
  if (countrySelected.length === 1 && countrySelected[0].id === '231') {
    stateSelected = countries.getStatesOfCountry(231)
      .filter(state => state.name === stateSelection ? stateSelection : null)
    citySelected = countries.getCitiesOfState(231)
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
      country: usersCountry,
      state: usersState,
      city: usersCity,
    }
  }, (err, userFound) => {
    if (err) {
      res.send({error: err})
    } else {
      console.log("userId\n", userId)
      res.status(201).send(userId)
    }
  })
})

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
          birthMonth: null,
          birthDate: null,
          birthYear: null,
          country: null,
          state: null,
          city: null,
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

module.exports = router
