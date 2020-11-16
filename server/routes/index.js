const express = require("express");
const jwt = require("jsonwebtoken");
const Cookies = require("js-cookie");
const path = require("path");
const JWT_SECRET = Buffer.from("fe1a1915a379f3be5394b64d14794932", "hex");

const authenticateToken = require("../config/auth");
const User = require("../models/user");
const Message = require("../models/message");
const Conversation = require("../models/conversation");

const router = express.Router();

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, authUser) => {
    if (err) throw new Error(err);
    if (!authUser) return res.sendStatus(403);

    User.comparePassword(req.body.password, authUser.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ authUserDetails: authUser }, JWT_SECRET, {
          expiresIn: "1 day",
        });
        res.json({ token, authUser });
      } else {
        res.sendStatus(403);
      }
    });
  });
});

router.get("/", (req, res, next) => {
  User.findOne({ _id: req.authUser._id }, (err, authUser) => {
    if (authUser && authUser.gender === "male") {
      User.find({ gender: "female" }, (err, allUsers) => {
        res.render("layouts/app/index", {
          locals: {
            title: "My Match",
            styles: [
              "/static/client/views/app/home/styles.css",
              "/static/client/views/partials/styles/app-nav.css",
              "/static/client/views/layouts/app/app-global-styles.css",
            ],
            scripts: [
              "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
              "https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js",
              "/static/client/views/layouts/app/handleLogout.js",
            ],
            authUser,
            allUsers,
          },
          partials: {
            nav: "partials/app-nav",
            body: "app/home/index",
          },
        });
      });
    } else {
      User.find({ gender: "male" }, (err, allUsers) => {
        res.render("layouts/app/index", {
          locals: {
            title: "My Match",
            styles: [
              "/static/client/views/app/home/styles.css",
              "/static/client/views/partials/styles/app-nav.css",
              "/static/client/views/layouts/app/app-global-styles.css",
            ],
            scripts: [
              "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
              "https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js",
              "/static/client/views/layouts/app/handleLogout.js",
            ],
            authUser,
            allUsers,
          },
          partials: {
            nav: "partials/app-nav",
            body: "app/home/index",
          },
        });
      });
    }
  });
});

// router.get('/', (req, res, next) => {
//   res.render('layouts/app/index', {
//     locals: {
//       title: 'My Match',
//       styles: [
//         '/static/client/views/app/home/styles.css',
//         '/static/client/views/partials/styles/app-nav.css',
//         '/static/client/views/layouts/app/app-global-styles.css',
//       ],
//       scripts: [
//         'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
//         'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
//         '/static/client/views/layouts/app/handleLogout.js',
//         '/static/client/views/app/home/main.js',
//       ],
//     },
//     partials: {
//       nav: 'partials/app-nav',
//       body: 'app/home/index',
//     }
//   })
// });

// router.get('/api/all-members', authenticateToken, (req, res, next) => {
//   User.findOne({ _id: req.user._id }, (err, user) => {
//     if (user && user.gender === 'male') {
//       User.find({ gender: 'female' }, (err, allUsers) => {
//         res.status(201).json({ user, allUsers });
//       })
//     } else {
//       User.find({ gender: 'female' }, (err, all) => {
//         res.status(201).send({ userName: user && user.name || 'User', all });
//       })
//     }
//   })
// });

// router.get("/search", (req, res, next) => {
//   User.findOne({ _id: req.authUser._id }, (err, authUser) => {
//     if (err) return res.sendStatus(403);
//     if (authUser !== null) {
//       res.render("app/search/search", {
//         authUser: authUser.toJSON(),
//         styles: [
//           "/static/client/views/partials/styles/app-nav.css",
//           "/static/client/views/layouts/app/app-global-styles.css",
//         ],
//       });
//     } else {
//       res.sendStatus(403);
//     }
//   });
// });

router.get("/api/signup-user-first-name", (req, res, next) => {
  User.findOne({ _id: req.headers.userid }, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user !== null) {
      res.status(201).send({ name: user.name });
    } else {
      res.sendStatus(403);
    }
  });
});

router.get("/api/user-details", authenticateToken, (req, res, next) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    res.status(201).send({ userId: user._id });
  });
});

router.put("/api/profile-info", (req, res) => {
  const token = req.headers["authorization"];
  const decodedUser = jwt.decode(token, JWT_SECRET);
  User.findOneAndUpdate(
    { username: decodedUser.username },
    { profilePicture: req.body.data },
    (err, member) => {
      res.json({ member });
    }
  );
});

module.exports = router;

// const aws = require('aws-sdk');
// const fs = require('fs')
// const connectMultipart = require('connect-multiparty');
// const imagemin = require('imagemin');
// const imageminMozjpeg = require("imagemin-mozjpeg");
// const imageminPngquant = require('imagemin-pngquant');
// const s3Credentials = require('./credentials.json');

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
