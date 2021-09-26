const express = require('express');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { usersCollection } = require('../db.js');
const { comparePassword } = require('../models/user');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await usersCollection().findOne({ email });
  if (!user) return res.sendStatus(401);

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) return res.sendStatus(401);

  const authUser = await usersCollection().findOneAndUpdate(
    { _id: ObjectId(user._id) },
    {
      $set: {
        lastLogin: new Date(),
      },
    }
  );

  const token = jwt.sign({ my_match_userId: authUser.value._id }, JWT_SECRET, {
    expiresIn: '1 day',
  });
  res.status(201).json({ token });
});

router.get('/users', async (req, res, next) => {
  try {
    const { authUser, allConversationsCount } = req;
    const page = parseInt(req.query.page);
    const skipRecords = page > 1 ? (page - 1) * 20 : 0;
  
    const allUsersCount = await usersCollection()
      .find({ gender: authUser.gender === 'male' ? 'female' : 'male' })
      .count();

    const allUsers = skipRecords <= 13200 ? await usersCollection()
      .find({ gender: authUser.gender === 'male' ? 'female' : 'male' })
      .sort({ lastLogin: -1 })
      .skip(skipRecords)
      .limit(20)
      .toArray()
      :
      await usersCollection()
        .find({ gender: authUser.gender === 'male' ? 'female' : 'male' })
        .sort()
        .skip(skipRecords)
        .limit(20)
        .toArray();

    const numberOfPages = Math.ceil(allUsersCount / 20);
    const currentPage = page || 1;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < numberOfPages ? currentPage + 1 : null;
  
    if (currentPage <= numberOfPages) {
      res.render('app/_layouts/index', {
        locals: {
          title: 'My Match',
          styles: [
            '/static/client/views/app/home/styles.css',
            '/static/client/views/app/_partials/app-nav.css',
            '/static/client/views/app/_layouts/app-global-styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
          ],
          authUser,
          allConversationsCount,
          allUsersCount,
          allUsers,
          previousPage,
          numberOfPages,
          currentPage,
          nextPage,
        },
        partials: {
          nav: 'app/_partials/app-nav',
          body: 'app/home/index',
        },
      });
    } else if (numberOfPages === 0) {
      res.render('app/_layouts/index', {
        locals: {
          title: 'My Match',
          styles: [
            '/static/client/views/app/home/styles.css',
            '/static/client/views/app/_partials/app-nav.css',
            '/static/client/views/app/_layouts/app-global-styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
          ],
          authUser,
          allConversationsCount,
          allUsersCount: 0,
          allUsers: [],
          previousPage: 0,
          numberOfPages: 1,
          currentPage: 1,
          nextPage,
        },
        partials: {
          nav: 'app/_partials/app-nav',
          body: 'app/home/index',
        },
      });
    } else {
      res.redirect(`/users?page=${numberOfPages}`);
    }
  } catch (error) {
    console.log(`error\n`, error);
  }
});

module.exports = router;
