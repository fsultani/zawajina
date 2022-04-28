const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { ObjectId } = require('mongodb');

const router = express.Router();

const personalInfo = require('./personalInfo');
const sendVerificationEmail = require('./sendVerificationEmail');
const resendEmail = require('./resendEmail');
const verifyEmail = require('./verifyEmail');
const profileDetails = require('./profileDetails');

const cities = require('../../helpers/cities');
const countries = require('../../helpers/countries');
const ethnicities = require('../../helpers/ethnicities');
const languages = require('../../helpers/languages');
const hobbies = require('../../helpers/hobbies');

const upload = require('../../helpers/multer');

const { usersCollection } = require('../../db.js');

router.post(
  '/api/personal-info',
  [
    check('nameValue').not().isEmpty().trim().escape().withMessage('Enter your name'),
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().withMessage('Enter a password'),
    check('password').isLength({ min: 8 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    personalInfo(req, res)
  }
);

router.get('/api/send-verification-email', (req, res) => sendVerificationEmail(req, res));

router.post('/api/resend-email', [
  check('email').isEmail().withMessage('Enter a valid email address'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  resendEmail(req, res);
})

router.get(
  '/api/verify-email',
  [
    check('verificationToken').not().isEmpty().withMessage('Enter a verification code'),
    check('verificationToken').isLength({ min: 5, max: 5 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    verifyEmail(req, res);
  }
);

router.get('/api/signup-user-first-name', (req, res, next) => {
  usersCollection().findOne({ _id: ObjectId(req.cookies.my_match_userId) }, (err, user) => {
    if (err || !user) return res.sendStatus(401);
    res.status(201).send({ name: user.name });
    // if (user.startedRegistrationAt && !user.emailVerified) {
    //   res.status(200).json({ message: 'Token Sent' })
    // } else if (user.startedRegistrationAt && user.emailVerified && !user.completedRegistrationAt) {
    //   res.status(201).send({ name: user.name });
    // } else {
    //   res.sendStatus(401);
    // }
  });
});

router.get('/api/cities', (req, res) => cities(req, res));
router.get('/api/ethnicities', (req, res) => ethnicities(req, res));
router.get('/api/countries', (req, res) => countries(req, res));
router.get('/api/languages', (req, res) => languages(req, res));
router.get('/api/hobbies', (req, res) => hobbies(req, res));

router.post(
  '/api/profile-details',
  upload.fields([
    {
      name: 'image-0',
      maxCount: 1,
    },
    {
      name: 'image-1',
      maxCount: 1,
    },
    {
      name: 'image-2',
      maxCount: 1,
    },
    {
      name: 'image-3',
      maxCount: 1,
    },
    {
      name: 'image-4',
      maxCount: 1,
    },
    {
      name: 'image-5',
      maxCount: 1,
    },
  ]),
  (req, res) => profileDetails(req, res)
);

module.exports = router;
