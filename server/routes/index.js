const express = require('express')
const jwt = require('jsonwebtoken');
const Cookies = require('js-cookie');
const path = require('path');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

const authenticateToken = require('../config/auth');
const User = require('../models/user');
const Message = require('../models/message');
const Conversation = require('../models/conversation');

const router = express.Router();

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw new Error(err);
    if (!user) return res.sendStatus(403);

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

router.get('/api/signup-user-first-name', (req, res, next) => {
  User.findOne({ _id: req.headers.userid }, (err, user) => {
    res.status(201).send({ name: user.name });
  })
})

router.get('/api/user-details', authenticateToken, (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    res.status(201).send({ name: user.name });
  })
})

router.get('/api/all-members', authenticateToken, (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (user && user.gender === 'male') {
      User.find({ gender: 'female' }, (err, all) => {
        res.status(201).send({ userName: user.name, all });
      })
    } else {
      User.find({ gender: 'female' }, (err, all) => {
        res.status(201).send({ userName: user && user.name || 'User', all });
      })
    }
  })
})

router.put('/api/profile-info', (req, res) => {
  const token = req.headers['authorization']
  const decodedUser = jwt.decode(token, JWT_SECRET)
  User.findOneAndUpdate({ username: decodedUser.username}, { profilePicture: req.body.data }, (err, member) => {
    res.json({ member })
  })
})

module.exports = router;

// const aws = require('aws-sdk');
// const fs = require('fs')
// const connectMultipart = require('connect-multiparty');
// const imagemin = require('imagemin');
// const imageminMozjpeg = require("imagemin-mozjpeg");
// const imageminPngquant = require('imagemin-pngquant');
// const s3Credentials = require('./s3Credentials.json');

// const s3 = new aws.S3(s3Credentials);
// const multipartMiddleware = connectMultipart();
// router.post('/api/upload', multipartMiddleware, async (req, res, next) => {
//   const file = req.files.upl;
//   const compressedFile = await imagemin(
//     [file.path],
//     {
//       destination: 'build',
//       plugins: [
//         imageminMozjpeg({ quality: 50 }),
//         imageminPngquant()
//       ]
//     }
//   );

//   s3.upload({
//     Bucket: 'my-match',
//     Key: file.originalFilename,
//     Body: compressedFile[0].data,
//     ACL: 'public-read',
//     ContentType: file.type,
//   }, (err, data) => {
//     if (err) return console.log("err\n", err);
//     fs.unlink(compressedFile[0].sourcePath, err => {
//       if (err) console.error(err);
//       fs.unlink(compressedFile[0].destinationPath, err => {
//         if (err) console.error(err);
//       })
//     });
//     res.status(201).json({ imgLocation: data.Location })
//   })
// });
