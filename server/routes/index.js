const express = require("express");
const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const Cookies = require("js-cookie");
const path = require("path");
const JWT_SECRET = Buffer.from("fe1a1915a379f3be5394b64d14794932", "hex");

const { mongoDb } = require('../db.js');
const { comparePassword } = require('../models/user');
const authenticateToken = require("../config/auth");
const User = require("../models/user");
const Message = require("../models/message");
const Conversation = require("../models/conversation");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await mongoDb().collection('users').findOne({ email })
  if (!user) return res.sendStatus(401);

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) return res.sendStatus(401);

  const authUser = await mongoDb().collection('users').findOneAndUpdate(
    { _id: ObjectId(user._id) },
    {
      $set: {
        isUserSessionValid: true,
        lastLogin: new Date(),
      }
    }
  );

  const token = jwt.sign({ userId: authUser.value._id }, JWT_SECRET, {
    expiresIn: "1 day",
  });
  res.status(201).json({ token });
});

router.get('/users', async (req, res, next) => {
  const authUser = req.authUser;
  const page = parseInt(req.query.page)
  const skipRecords = page > 1 ? (page - 1) * 20 : 0;

  const allUsersCount = await mongoDb().collection('users')
    .find({ gender: authUser.gender === 'male' ? 'female' : 'male' })
    .count()

  const allUsers = await mongoDb().collection('users')
    .find({ gender: authUser.gender === 'male' ? 'female' : 'male' })
    .sort({ lastLogin: -1})
    .skip(skipRecords)
    .limit(20)
    .toArray();

  const numberOfPages = Math.ceil(allUsersCount / 20);
  const currentPage = page || 1;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < numberOfPages ? currentPage + 1 : null;

  if (currentPage <= numberOfPages) {
    res.render('layouts/app/index', {
      locals: {
        title: 'My Match',
        styles: [
          '/static/client/views/app/home/styles.css',
          '/static/client/views/partials/styles/app-nav.css',
          '/static/client/views/layouts/app/app-global-styles.css',
        ],
        scripts: [
          'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
          'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
          '/static/client/views/layouts/app/handleLogout.js',
        ],
        authUser,
        allUsersCount,
        allUsers,
        previousPage,
        numberOfPages,
        currentPage,
        nextPage,
      },
      partials: {
        nav: 'partials/app-nav',
        body: 'app/home/index',
      },
    });
  } else {
    res.redirect(`/users?page=${numberOfPages}`)
  }
});

router.get("/api/signup-user-first-name", (req, res, next) => {
  mongoDb().collection('users').findOne({ _id: ObjectId(req.headers.userid)}, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user !== null) {
      res.status(201).send({ name: user.name });
    } else {
      res.sendStatus(403);
    }
  });
});

module.exports = router;
