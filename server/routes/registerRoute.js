const express = require('express');
const axios = require('axios');
const { check, body, validationResult } = require('express-validator/check');
const countries = require('./world-cities');

const jwt = require('jsonwebtoken');
const moment = require('moment')
const aws = require('aws-sdk');
const fs = require('fs')
const multer = require('multer');
const connectMultipart = require('connect-multiparty');
const imagemin = require('imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require('imagemin-pngquant');

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
            return res.status(201).json({
              startedRegistration: userExists.startedRegistration,
              userId: userExists._id,
            });
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

router.get('/api/cities-list', async (req, res) => {
  const { userIPAddress } = req.query;
  try {
    const response = await axios.get(`http://ip-api.com/json/${userIPAddress}`);
    res.json({ allCountries: countries.default.getAllCities(), userLocationData: response.data })
  } catch (err) {
    return res.json({ error: err.response })
  }
});


const s3 = new aws.S3({
  "accessKeyId": process.env.DEVELOPMENT ? require('./s3Credentials.json').accessKeyId : process.env.AWS_ACCESS_KEY_ID,
  "secretAccessKey": process.env.DEVELOPMENT ? require('./s3Credentials.json').SECRETACCESSKEY : process.env.AWS_SECRET_ACCESS_KEY
});

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalname.split('.')[1];
    cb(null, `${random}.${fileExtension}`);
  }
});

const upload = multer({ storage: storage });
router.post('/api/about', upload.fields([
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
  {
    name: 'image-6',
    maxCount: 1,
  },
]), (req, res) => {
  const {
    birthMonth,
    birthDay,
    birthYear,
    gender,
    country,
    state,
    city,
  } = JSON.parse(req.body.userInfo);

  const fullDob = `${birthMonth}/${birthDay}/${birthYear}`;
  const today = new Date();
  const dob = new Date(fullDob);
  let age = today.getFullYear() - dob.getFullYear();
  const month = today.getMonth() - dob.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
    age = age - 1;
  }

  const userId = req.body.userId;

  Object.values(req.files).length > 0 && Object.values(req.files).map(async image => {
    const compressedFile = await imagemin(
      [image[0].path],
      {
        destination: 'compressed',
        plugins: [
          imageminMozjpeg({ quality: 30 }),
          imageminPngquant()
        ]
      }
    );

    s3.upload({
      Bucket: 'my-match',
      Key: `${userId}/${compressedFile[0].sourcePath.split('/')[1]}`,
      Body: compressedFile[0].data,
      ACL: 'public-read',
      ContentType: image[0].mimetype,
    }, (err, data) => {
      if (err) return console.log("err\n", err);
      fs.unlink(compressedFile[0].sourcePath, err => {
        if (err) return console.error(err);
        fs.unlink(compressedFile[0].destinationPath, err => {
          if (err) return console.error(err);
        })
      });

      User.findOneAndUpdate({ _id: userId }, {
        $push: { photos: data.Location }
      }, { new: true }, (err, user) => {
        if (err) return res.send({ error: err })
      })
    })
  });

  User.findOneAndUpdate({ _id: userId }, {
    $set: {
      fullDob,
      age,
      gender,
      country,
      state,
      city,
      completedRegistration: true,
      isUserSessionValid: true,
    },
  }, { new: true }, (err, user) => {
    if (err) return res.send({error: err});
    const token = jwt.sign({ userDetails: user }, JWT_SECRET, { expiresIn: '1 day' });
    res.status(201).json({ token, userId });
  })
})

module.exports = router;
