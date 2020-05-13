const express = require('express')
const jwt = require('jsonwebtoken');
const Cookies = require('js-cookie');
const path = require('path');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')
const multer = require('multer')
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const authenticateToken = require('../config/auth');

const router = express.Router();

const User = require('../models/user');
const Message = require('../models/message');
const Conversation = require('../models/conversation');

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
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

router.post('/api/upload', upload.array('upl', 1), (req, res, next) => {
    res.status(201).send();
});

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      throw new Error(err);
    }

    User.comparePassword(req.body.password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(
          { userDetails: user },
          JWT_SECRET,
          { expiresIn: '1 day' });
        res.json({ token })
      } else {
        res.sendStatus(403);
      }
    })
  })
})

router.get('/api/user-details', authenticateToken, (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    res.status(201).send({ name: user.name });
  })
})

router.put('/api/profile-info', (req, res) => {
  const token = req.headers['authorization']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.findOneAndUpdate({ username: decodedUser.username}, { profilePicture: req.body.data }, (err, member) => {
    console.log('The member is\n', member)
    res.json({ member })
  })
})

router.get('/api/all-members', (req, res, next) => {
  const token = req.headers['authorization']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.findOne({ email: decodedUser.email }, (err, user) => {
    if (!user) {
      return res.status(403).send("Authentication failed. User not found.")
    } else {
      user.gender === 'male' ? (
        User.find({gender: 'female'}, (err, all) => {
          res.json({all: all})
        })
      ) : (
        User.find({gender: 'male'}, (err, all) => {
          res.json({all: all})
        })
      )
    }
  })
})

module.exports = router;
