const express = require('express');
const { check, body, validationResult } = require('express-validator/check');
const countries = require('country-state-city');
const jwt = require('jwt-simple');
const moment = require('moment')

const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const User = require('../models/user');

const router = express.Router();

router.post('/api/personal-info', [
  check('name').not().isEmpty().withMessage('Enter your name'),
  check('email').isEmail().withMessage('Enter a valid email address'),
  check('password').not().isEmpty().withMessage('Enter a password'),
  check('password').isLength({ min: 8 }),
], (req, res) => {
  const { name, email, password } = req.body;
  const getErrors = validationResult(req);

  if (!getErrors.isEmpty()) {
    return res.status(400).json({ error: getErrors.array() });
  } else {
    User.findOne({ email }, (err, userExists) => {
      // User does not exist; create a new account
      if (!userExists) {
        const newUser = new User ({
          name,
          email,
          password,
          startedRegistration: true,
          completedRegistration: false,
          isUserSessionValid: false,
        });

        User.createUser(newUser, (err, user) => {
          if (err) throw new Error(err);
          const userId = user._id;
          return res.status(201).send({ userId });
        })
      } else if (userExists.startedRegistration && !userExists.completedRegistration) {
        // User started registration, but did not complete it
        User.updateOne({ _id: userExists._id }, {
          $set: {
            name,
            password
          }
        }, (err, userFound) => {
          if (err) {
            return res.json({ error: "Unknown error" });
          } else {
            return res.status(200).json({ startedRegistration: userExists.startedRegistration });
          }
        })
      } else if (userExists.startedRegistration && userExists.completedRegistration) {
        return res.status(403).json({ error: "Account already exists" });
      } else {
        return res.json({ error: "Unknown error" });
      }
    })
  }
})

router.get('/api/all-countries', (req, res) => {
  const countryList = countries.default.getAllCountries();
  res.send(countryList);
})

router.get('/api/state-list', (req, res) => {
  const stateList = countries.default.getStatesOfCountry("231");
  res.send(stateList);
})

router.get('/api/cities-list', ({ query }, res) => {
  if (query.stateId) {
    res.send(countries.default.getCitiesOfState(query.stateId));
  } else {
    res.send(countries.default.getStatesOfCountry(query.countryId));
  }
})

router.post('/api/about', (req, res) => {
  const {
    birthMonth,
    birthDay,
    birthYear,
    gender,
    country,
    state,
    city,
  } = req.body.userInfo;

  const dobMonth = moment().month(birthMonth).format('MM');
  const dobDate = moment().date(birthDay).format('DD');
  const fullDob = `${birthYear}${dobMonth}${dobDate}`;
  const userAge = moment().diff(fullDob, 'years');
  const userId = req.body.userId;

  User.updateOne({ _id: userId }, {
    $set: {
      fullDob,
      userAge,
      gender,
      country,
      state,
      city,
      completedRegistration: true,
      isUserSessionValid: true,
    }
  }, (err, userFound) => {
    if (err) {
      res.send({error: err});
    } else {
      const token = jwt.encode({ email: userFound.email }, JWT_SECRET);
      res.status(201).send({ token, userId });
    }
  })
})

module.exports = router;
