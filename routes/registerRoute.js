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
  const { country, state, city, userId } = req.body.data
  const countryId = parseInt(country)
  const stateId = parseInt(state !== null ? state : null)
  const cityId = parseInt(city)
  console.log("stateId\n", stateId)

  const countryName = countries.getCountryById(countryId - 1)
  const stateName = stateId ? countries.getStateById(stateId - 1) : null
  const cityName = countries.getCitiesOfState(cityId - 1)

  // console.log("countryName\n", countryName)
  // console.log("stateName\n", stateName)
  // console.log("cityName\n", cityName)

  User.update({ _id: userId }, {
    $set: {
      country: countryName.name,
      state: stateName ? stateName : null,
      city: cityName.name,
    }
  }, (err, userFound) => {})
})

router.post('/api/personal-info', [
  check('userRegistrationForm.name').not().isEmpty().withMessage('Enter your name'),
  check('userRegistrationForm.email').isEmail().withMessage('Enter a valid email address'),
  check('userRegistrationForm.password').not().isEmpty().withMessage('Enter a password'),
  check('userRegistrationForm.gender').not().isEmpty().withMessage('Select your gender'),
  check('userRegistrationForm.birthMonth').not().equals('Month').withMessage('Select your birth month'),
  check('userRegistrationForm.birthDate').not().equals('Day').withMessage('Select your birth day'),
  check('userRegistrationForm.birthYear').not().equals('Year').withMessage('Select your birth year'),
  ], (req, res) => {
  const name = req.body.userRegistrationForm.name
  const email = req.body.userRegistrationForm.email
  const password = req.body.userRegistrationForm.password
  const gender = req.body.userRegistrationForm.gender
  const birthMonth = req.body.userRegistrationForm.birthMonth
  const birthDate = req.body.userRegistrationForm.birthDate
  const birthYear = req.body.userRegistrationForm.birthYear

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
          gender,
          birthMonth,
          birthDate,
          birthYear,
          country: null,
          state: null,
          city: null,
        })

        User.createUser(newUser, (err, user) => {
          console.log("err\n", err)
          console.log("user\n", user)
          const token = jwt.encode({ email: user.email }, JWT_SECRET)
          const userId = user.id
          res.status(201).send({ userId })
        })
        // res.status(201).end()
      } else if (userExists.email) {
        res.json({ error: "Email already exists"})
      } else {
        res.json({ error: "Unknown error" })
      }
    })
  }
})

module.exports = router
