const express = require('express');
const { check, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

const router = express.Router();

const googleAuth = require('./googleAuth');
const personalInfo = require('./personalInfo');
const checkEmailVerification = require('./checkEmailVerification');
const { resendEmail } = require('./resendEmail');
const verifyEmail = require('./verifyEmail');
const profileDetails = require('./profileDetails');

const location = require('../../helpers/location');
const countries = require('../../helpers/countries');
const ethnicities = require('../../helpers/ethnicities');
const languages = require('../../helpers/languages');
const hobbies = require('../../helpers/hobbies');

const upload = require('../../helpers/multer');

const { usersCollection } = require('../../db.js');

router.post('/google-auth', (req, res) => googleAuth(req, res));

router.post(
  '/personal-info',
  [
    check('email').isEmail().withMessage('Invalid email'),
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

router.get('/check-email-verification', (req, res) => checkEmailVerification(req, res));

router.post('/resend-email', [
  check('email').isEmail().withMessage('Enter a valid email address'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  resendEmail(req, res);
})

router.put('/verify-email', (req, res) => verifyEmail(req, res));

router.get('/signup-user-first-name', (req, res) => {
  usersCollection().findOne({ _id: ObjectId(req.cookies.my_match_userId) }, (err, user) => {
    if (err || !user) return res.sendStatus(401);
    res.status(201).send({ name: user.name });
  });
});

router.get('/location', (req, res) => location(req, res));
router.get('/ethnicities', (req, res) => ethnicities(req, res));
router.get('/countries', (req, res) => countries(req, res));
router.get('/languages', (req, res) => languages(req, res));
router.get('/hobbies', (req, res) => hobbies(req, res));

router.post(
  '/profile-details',
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
