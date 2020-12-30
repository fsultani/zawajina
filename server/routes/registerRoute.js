const express = require('express');
const { ObjectId } = require('mongodb');
var bcrypt = require('bcryptjs');
const axios = require('axios');
const { check, body, validationResult } = require('express-validator/check');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const aws = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const connectMultipart = require('connect-multiparty');
const Jimp = require('jimp')

const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { mongoDb } = require('../db.js');
const { createUser } = require('../models/user');
const countries = require('./world-cities');
const ethnicities = require('./ethnicities');
const User = require('../models/user');

const router = express.Router();

router.post(
  '/api/personal-info',
  [
    check('name').not().isEmpty().withMessage('Enter your name'),
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty().withMessage('Enter a password'),
    check('password').isLength({ min: 8 }),
  ],
  (req, res) => {
    const { name, email, password } = req.body;
    const getErrors = validationResult(req);

    if (!getErrors.isEmpty()) {
      return res.status(400).json({ error: getErrors.array() });
    } else {
      mongoDb().collection('users').findOne({ email }, (err, userExists) => {
        if (!userExists) {
          // User does not exist; create a new account
          const newUser = {
            name,
            email,
            password,
            startedRegistrationAt: new Date(),
            completedRegistrationAt: false,
            isUserSessionValid: false,
          };

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash;
              mongoDb().collection('users').insertOne(newUser, (err, user) => {
                if (err) throw Error(err);
                const userId = user.insertedId;
                return res.status(201).send({ userId });
              });
            });
          });

        } else if (userExists.startedRegistrationAt && !userExists.completedRegistrationAt) {
          // User completed step 1 only
          mongoDb().collection('users').findOneAndUpdate(
            { _id: userExists._id },
            {
              $set: {
                name,
                password,
              },
            },
            (err, user) => {
              if (err) {
                return res.json({ error: 'Unknown error' });
              } else {
                return res.status(201).json({
                  startedRegistrationAt: userExists.startedRegistrationAt,
                  userId: userExists._id,
                });
              }
            }
          );
        } else if (userExists.startedRegistrationAt && userExists.completedRegistrationAt) {
          // Email address already exists
          return res.status(403).json({ error: 'Account already exists' });
        } else {
          return res.json({ error: 'Unknown error' });
        }
      });
    }
  }
);

let locationDataWasCalled = false;
let userLocationData;
let userCity;
let userState;
let userCountry;
let locationResponse;

router.get('/api/cities-list', async (req, res) => {
  const { userIPAddress, userInput } = req.query;
  const allLocations = [];
  const allResults = [];
  try {
    if (!locationDataWasCalled) {
      userLocationData = await axios.get(`http://ip-api.com/json/${userIPAddress}`);
      userCity = userLocationData.data.city;
      userState = userLocationData.data.region;
      userCountry = userLocationData.data.country;
      locationResponse = countries.default.getAllCities();
      locationDataWasCalled = true;
    }

    const filteredResults = locationResponse.filter(element => {
      const hasComma = userInput.indexOf(',') !== -1;
      if (hasComma) {
        if (element.state) {
          return element.state
            .toLowerCase()
            .startsWith(userInput.split(',')[1].toLowerCase().trim());
        } else {
          return element.country
            .toLowerCase()
            .startsWith(userInput.split(',')[1].toLowerCase().trim());
        }
      } else {
        return element.city.toLowerCase().startsWith(userInput.toLowerCase());
      }
    });

    filteredResults.sort((a, b) => {
      if (b.city.startsWith(userCity) > a.city.startsWith(userCity)) return 1;
      if (b.city.startsWith(userCity) < a.city.startsWith(userCity)) return -1;

      if (b.country.startsWith(userCountry) > a.country.startsWith(userCountry)) return 1;
      if (b.country.startsWith(userCountry) < a.country.startsWith(userCountry)) return -1;

      if (a.state === b.state) {
        return 0;
      } else if (a.state === null) {
        return 1;
      } else if (b.state === null) {
        return -1;
      } else {
        return b.state.startsWith(userState) - a.state.startsWith(userState);
      }
    });

    for (let i = 0; i < filteredResults.length; i++) {
      const country =
        filteredResults[i].country === 'United States' ? 'USA' : filteredResults[i].country;
      const fullLocation = `${filteredResults[i].city}, ${
        filteredResults[i].state ? `${filteredResults[i].state}, ${country}` : country
      }`;

      if (fullLocation.substr(0, userInput.length).toUpperCase() == userInput.toUpperCase()) {
        const search = new RegExp(userInput, 'gi');
        const match = fullLocation.replace(search, match => `<strong>${match}</strong>`);
        allResults.push({
          match,
          city: filteredResults[i].city,
          state: filteredResults[i].state,
          country: country,
        });
      }
    }

    const results = allResults.slice(0, 7);
    res.send(results);
  } catch (err) {
    return res.json({ error: err.locationResponse });
  }
});

let ethnicityWasCalled = false;
let ethnicityResponse;
router.get('/api/ethnicities-list', async (req, res) => {
  const { userInput } = req.query;

  try {
    if (!ethnicityWasCalled) {
      ethnicityResponse = ethnicities.default.getAllEthnicities();
      ethnicityWasCalled = true;
    }

    const filteredResults = ethnicityResponse.filter(element => element.toLowerCase().startsWith(userInput.toLowerCase()));
    filteredResults.sort((a, b) => b < a)
    res.send(filteredResults);
  } catch (err) {
    return res.json({ error: err.ethnicityResponse });
  }
});

// const s3 = new aws.S3({
//   accessKeyId: process.env.DEVELOPMENT
//     ? require('./credentials.json').s3accessKeyId
//     : process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.DEVELOPMENT
//     ? require('./credentials.json').s3secretAccessKey
//     : process.env.AWS_SECRET_ACCESS_KEY,
// });

cloudinary.config({
  cloud_name: process.env.DEVELOPMENT ? require('./credentials.json').cloudinaryCloudName : process.env.cloudinaryCloudName,
  api_key: process.env.DEVELOPMENT ? require('./credentials.json').cloudinaryApiKey : process.env.cloudinaryApiKey,
  api_secret: process.env.DEVELOPMENT ? require('./credentials.json').cloudinaryApiSecret : process.env.cloudinaryApiSecret,
});

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    const random =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalname.split('.')[1];
    cb(null, `${random}.${fileExtension}`);
  },
});

const upload = multer({ storage: storage });
router.post(
  '/api/about',
  upload.fields([
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
  ]),
  (req, res) => {
    const userId = req.body.userId;
    const { birthMonth, birthDay, birthYear, gender, country, state, city, ethnicity } = JSON.parse(
      req.body.userInfo
    );

    const fullDob = `${birthMonth}/${birthDay}/${birthYear}`;
    const today = new Date();
    const dob = new Date(fullDob);
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();

    const ethnicitySelection = ethnicity.split()

    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
      age = age - 1;
    }

    if (req.files && Object.values(req.files).length > 0) {
      const allImages = [];
      const userImages = Object.values(req.files).map(async (image, index) => {
        const file = image[0];
        const fileName = file.filename.split('.')[0];
        const compressedFilePath = `compressed/${file.filename.split('.')[0]}.jpg`;
        const jpgImage = await Jimp.read(file.path);
        await jpgImage.cover(640, 640).quality(100).write(compressedFilePath);
        const uploadToCloudinary = await cloudinary.uploader.upload(compressedFilePath, {
          folder: userId,
        })
        allImages.push(uploadToCloudinary.secure_url);
        fs.unlink(file.path, err => {
          if (err) return console.error(err);
          fs.unlink(compressedFilePath, err => {
            if (err) return console.error(err);
          });
        });
      })

      Promise.all(userImages).then(() => {
        mongoDb().collection('users').findOneAndUpdate(
          { _id: ObjectId(userId) },
          {
            $set: {
              fullDob,
              age,
              gender,
              country,
              state,
              city,
              photos: allImages,
              ethnicity: ethnicitySelection,
              completedRegistrationAt: new Date(),
              isUserSessionValid: true,
              lastLogin: new Date(),
            },
          },
          { new: true }, (err, user) => {
            const token = jwt.sign({ userId: user.value._id }, JWT_SECRET, {
              expiresIn: '1 day',
            });
            res.status(201).json({ token });
          });
      })
    } else {
      const allImagesArray = [
        'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951248/5fe6a54a2f3fa93aad83aa49/zfucr4bfuoff4aibwvio.jpg',
        'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951248/5fe6a54a2f3fa93aad83aa49/tmfvnssdmpoz0ct7pq2s.jpg',
        'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951250/5fe6a54a2f3fa93aad83aa49/m8ygr6hz9i6jvuqig1tv.jpg',
        'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951250/5fe6a54a2f3fa93aad83aa49/nuyegob47msffx6lzhva.jpg',
        'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951250/5fe6a54a2f3fa93aad83aa49/h0s34njkv4o7c6krpvms.jpg',
        'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951251/5fe6a54a2f3fa93aad83aa49/jekn1peld8nzaan5jgsy.jpg'
      ]

      const images = Array(allImagesArray.length).fill().map((_, index) => index);
      images.sort(() => Math.random() - 0.5);
      const allImages = []
      images.map(number => allImages.push(allImagesArray[number]))

      mongoDb().collection('users').findOneAndUpdate(
        { _id: ObjectId(userId) },
        {
          $set: {
            fullDob,
            age,
            gender,
            country,
            state,
            city,
            photos: allImages,
            ethnicitySelection,
            completedRegistrationAt: new Date(),
            isUserSessionValid: true,
            lastLogin: new Date(),
          },
        },
        { new: true },
        (err, user) => {
          if (err) return res.send({ error: err });
          const token = jwt.sign({ userId: user.value._id }, JWT_SECRET, {
            expiresIn: '1 day',
          });
          res.status(201).json({ token });
        }
      );
    }
  }
);

module.exports = router;
