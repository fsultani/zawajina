const express = require("express");
const axios = require("axios");
const { check, body, validationResult } = require("express-validator/check");
const countries = require("./world-cities");

const jwt = require("jsonwebtoken");
const moment = require("moment");
const aws = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");
const connectMultipart = require("connect-multiparty");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
// const imageminPngquant = require("imagemin-pngquant");

const JWT_SECRET = Buffer.from("fe1a1915a379f3be5394b64d14794932", "hex");

const User = require("../models/user");

const router = express.Router();

router.post(
  "/api/personal-info",
  [
    check("name").not().isEmpty().withMessage("Enter your name"),
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password").not().isEmpty().withMessage("Enter a password"),
    check("password").isLength({ min: 8 }),
  ],
  (req, res) => {
    const { name, email, password } = req.body;
    const getErrors = validationResult(req);

    if (!getErrors.isEmpty()) {
      return res.status(400).json({ error: getErrors.array() });
    } else {
      User.findOne({ email }, (err, userExists) => {
        if (!userExists) {
          // User does not exist; create a new account
          const newUser = new User({
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
          });
        } else if (userExists.startedRegistration && !userExists.completedRegistration) {
          // User completed only step 1
          User.updateOne(
            { _id: userExists._id },
            {
              $set: {
                name,
                password,
              },
            },
            (err, user) => {
              if (err) {
                return res.json({ error: "Unknown error" });
              } else {
                return res.status(201).json({
                  startedRegistration: userExists.startedRegistration,
                  userId: userExists._id,
                });
              }
            }
          );
        } else if (userExists.startedRegistration && userExists.completedRegistration) {
          // Email address already exists
          return res.status(403).json({ error: "Account already exists" });
        } else {
          return res.json({ error: "Unknown error" });
        }
      });
    }
  }
);

let wasCalled = false;
let userLocationData;
let userCity;
let userState;
let userCountry;
let response;

router.get("/api/cities-list", async (req, res) => {
  const { userIPAddress, userInput } = req.query;
  const allLocations = [];
  const allResults = [];
  try {
    if (!wasCalled) {
      userLocationData = await axios.get(`http://ip-api.com/json/${userIPAddress}`);
      userCity = userLocationData.data.city;
      userState = userLocationData.data.region;
      userCountry = userLocationData.data.country;
      response = countries.default.getAllCities();
      wasCalled = true;
    }

    const filteredResults = response.filter(element => {
      const hasComma = userInput.indexOf(",") !== -1;
      if (hasComma) {
        if (element.state) {
          return element.state
            .toLowerCase()
            .startsWith(userInput.split(",")[1].toLowerCase().trim());
        } else {
          return element.country
            .toLowerCase()
            .startsWith(userInput.split(",")[1].toLowerCase().trim());
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
        filteredResults[i].country === "United States" ? "USA" : filteredResults[i].country;
      const fullLocation = `${filteredResults[i].city}, ${
        filteredResults[i].state ? `${filteredResults[i].state}, ${country}` : country
      }`;

      if (fullLocation.substr(0, userInput.length).toUpperCase() == userInput.toUpperCase()) {
        const search = new RegExp(userInput, "gi");
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
    return res.json({ error: err.response });
  }
});

const s3 = new aws.S3({
  accessKeyId: process.env.DEVELOPMENT
    ? require("./s3Credentials.json").accessKeyId
    : process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.DEVELOPMENT
    ? require("./s3Credentials.json").SECRETACCESSKEY
    : process.env.AWS_SECRET_ACCESS_KEY,
});

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const random =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalname.split(".")[1];
    cb(null, `${random}.${fileExtension}`);
  },
});

const upload = multer({ storage: storage });
router.post(
  "/api/about",
  upload.fields([
    {
      name: "image-1",
      maxCount: 1,
    },
    {
      name: "image-2",
      maxCount: 1,
    },
    {
      name: "image-3",
      maxCount: 1,
    },
    {
      name: "image-4",
      maxCount: 1,
    },
    {
      name: "image-5",
      maxCount: 1,
    },
    {
      name: "image-6",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    const { birthMonth, birthDay, birthYear, gender, country, state, city } = JSON.parse(
      req.body.userInfo
    );

    const fullDob = `${birthMonth}/${birthDay}/${birthYear}`;
    const today = new Date();
    const dob = new Date(fullDob);
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
      age = age - 1;
    }

    const userId = req.body.userId;

    req.files &&
      Object.values(req.files).length > 0 &&
      Object.values(req.files).map(async image => {
        const compressedFile = await imagemin([image[0].path], {
          destination: "compressed",
          plugins: [imageminMozjpeg({ quality: 30 }), imageminPngquant()],
        });

        s3.upload(
          {
            Bucket: "my-match",
            Key: `${userId}/${compressedFile[0].sourcePath.split("/")[1]}`,
            Body: compressedFile[0].data,
            ACL: "public-read",
            ContentType: image[0].mimetype,
          },
          (err, data) => {
            if (err) return console.log("err\n", err);
            fs.unlink(compressedFile[0].sourcePath, err => {
              if (err) return console.error(err);
              fs.unlink(compressedFile[0].destinationPath, err => {
                if (err) return console.error(err);
              });
            });

            User.findOneAndUpdate(
              { _id: userId },
              {
                $push: { photos: data.Location },
              },
              { new: true },
              (err, user) => {
                if (err) return res.send({ error: err });
              }
            );
          }
        );
      });

    User.findOneAndUpdate(
      { _id: userId },
      {
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
      },
      { new: true },
      (err, user) => {
        if (err) return res.send({ error: err });
        const token = jwt.sign({ authUserDetails: user }, JWT_SECRET, {
          expiresIn: "1 day",
        });
        res.status(201).json({ token, userId });
      }
    );
  }
);

module.exports = router;
