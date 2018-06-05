const express = require('express')
const { check, body, validationResult } = require('express-validator/check')
const router = express.Router()
const User = require('../models/user')

router.post('/', [
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
    const newUser = new User ({
      name: name,
      email: email,
      password: password,
      gender: gender,
      birthMonth,
      birthDate,
      birthYear
    })

    User.createUser(newUser, (err, user) => {})
    res.status(201).end()
  }
})

module.exports = router
