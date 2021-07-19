// routes/user
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

const { usersCollection } = require('../db.js');

router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  const { authUser, conversationsCount } = req;

  const user = await usersCollection().findOne({ _id: ObjectId(userId) });
  if (!user) return res.redirect('/users');
  const lastLogin = new Date(user.lastLogin);
  const today = new Date();
  const minutesSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / 1000 / 60);

  let lastActive;
  if (minutesSinceLastLogin === 0) {
    lastActive = 'Just now';
  } else if (minutesSinceLastLogin === 1) {
    lastActive = '1 minute ago';
  } else if (minutesSinceLastLogin > 1 && minutesSinceLastLogin < 60) {
    lastActive = `${minutesSinceLastLogin} minutes ago`;
  } else if (minutesSinceLastLogin >= 60 && minutesSinceLastLogin < 60 * 2) {
    lastActive = '1 hour ago';
  } else if (minutesSinceLastLogin >= 60 * 2 && minutesSinceLastLogin < 60 * 24) {
    lastActive = `${Math.floor(minutesSinceLastLogin / 60)} hours ago`;
  } else if (minutesSinceLastLogin >= 60 * 24 && minutesSinceLastLogin < 60 * 24 * 2) {
    lastActive = '1 day ago';
  } else if (minutesSinceLastLogin >= 60 * 24 * 2 && minutesSinceLastLogin < 60 * 24 * 30) {
    lastActive = `${Math.floor(minutesSinceLastLogin / 60 / 24)} days ago`;
  } else if (minutesSinceLastLogin >= 60 * 24 * 30 && minutesSinceLastLogin < 60 * 24 * 30 * 2) {
    lastActive = '1 month ago';
  } else if (
    minutesSinceLastLogin >= 60 * 24 * 30 * 2 &&
    minutesSinceLastLogin < 60 * 24 * 30 * 12
  ) {
    lastActive = `${Math.floor(minutesSinceLastLogin / 60 / 24 / 30)} months ago`;
  } else {
    lastActive = '12+ months ago';
  }

  res.render('app/_layouts/index', {
    locals: {
      title: 'My Match',
      styles: [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
        '/static/client/views/app/_partials/app-nav.css',
        '/static/client/views/app/_layouts/app-global-styles.css',
        '/static/client/views/app/profile/styles.css',
      ],
      scripts: [
        'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
        'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
        '/static/client/views/app/profile/main.js',
      ],
      authUser,
      conversationsCount,
      lastActive,
      user,
    },
    partials: {
      nav: 'app/_partials/app-nav',
      body: 'app/profile/index',
    },
  });
});

module.exports = router;
