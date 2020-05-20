const express = require('express');
const { check, body, validationResult } = require('express-validator/check');
const countries = require('country-state-city');
const jwt = require('jsonwebtoken');
const moment = require('moment')
const multer = require('multer')
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

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
        }, (err, user) => {
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

aws.config.update({
  accessKeyId: 'AKIAIBPIBROA6XZWYFIQ',
  secretAccessKey: '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',
  region: 'us-east-1'
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'my-match',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const today = new Date();
      cb(null, file.originalname)
      console.log("file\n", file);
    }
  })
});

router.post('/api/about', upload.array('image-1', 1), (req, res) => {
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

  User.findOneAndUpdate({ _id: userId }, {
    $set: {
      fullDob,
      userAge,
      gender,
      country,
      state,
      city,
      completedRegistration: true,
      isUserSessionValid: true,
    },
  }, { new: true }, (err, user) => {
    if (err) {
      res.send({error: err});
    } else {
      const token = jwt.sign({ userDetails: user }, JWT_SECRET, { expiresIn: '1 day' });
      res.status(201).send({ token, userId });
    }
  })
})

module.exports = router;
