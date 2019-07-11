const express = require('express')
const { check, body, validationResult } = require('express-validator/check')
const countries = require('country-state-city')
const jwt = require('jwt-simple')
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

const User = require('../models/user')

const router = express.Router()

router.post('/api/personal-info', [
  check('firstName').not().isEmpty().withMessage('Enter your first name'),
  check('lastName').not().isEmpty().withMessage('Enter your last name'),
  check('userEmail').isEmail().withMessage('Enter a valid email address'),
  check('userPassword').not().isEmpty().withMessage('Enter a password'),
  check('userPassword').isLength({ min: 8 }),
], (req, res) => {
  const { firstName, lastName, userEmail, userPassword } = req.body;
  const getErrors = validationResult(req);

  if (!getErrors.isEmpty()) {
    return res.status(400).json({ error: getErrors.array() })
  } else {
    User.findOne({ userEmail }, (err, userExists) => {
      if (!userExists) {
        const newUser = new User ({
          firstName,
          lastName,
          userEmail,
          userPassword
        })

        User.createUser(newUser, (err, user) => {
          const token = jwt.encode({ email: user.userEmail }, JWT_SECRET)
          const userId = user._id
          return res.status(201).send({ token })
        })
      } else if (userExists.userEmail) {
        return res.status(200).json({ error: "Email already exists"})
      } else {
        return res.json({ error: "Unknown error" })
      }
    })
  }
})

module.exports = router
