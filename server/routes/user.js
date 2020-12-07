// routes/user
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

const { mongoDb } = require('../db.js');

router.get('/:userId', (req, res, next) => {
  const { userId } = req.params;
  const authUser = req.authUser;

  mongoDb().collection('users').findOne({ _id: ObjectId(userId)}, (err, user) => {
    if (err) return res.sendStatus(403);
    if (!user) {
      res.sendStatus(403);
    } else {
      const lastLogin = new Date(user.lastLogin);
      // const lastLogin = new Date('2020-11-27T00:00:00.000Z');
      const today = new Date();
      const minutesSinceLastLogin = Math.floor(((today.getTime() - lastLogin.getTime()) / 1000 / 60));

      let lastActive;
      if (minutesSinceLastLogin === 0) {
        lastActive = 'Just now'
      } else if (minutesSinceLastLogin === 1) {
        lastActive = '1 minute ago'
      } else if (minutesSinceLastLogin > 1 && minutesSinceLastLogin < 60) {
        lastActive = `${minutesSinceLastLogin} minutes ago`
      } else if (minutesSinceLastLogin >= 60  && minutesSinceLastLogin < (60 * 2)) {
        lastActive = '1 hour ago';
      } else if (minutesSinceLastLogin >= (60 * 2)  && minutesSinceLastLogin < (60 * 24)) {
        lastActive = `${Math.floor(minutesSinceLastLogin / 60)} hours ago`;
      } else if (minutesSinceLastLogin >= (60 * 24)  && minutesSinceLastLogin < (60 * 24 * 2)) {
        lastActive = '1 day ago';
      } else if (minutesSinceLastLogin >= (60 * 24 * 2)  && minutesSinceLastLogin < (60 * 24 * 30)) {
        lastActive = `${Math.floor(minutesSinceLastLogin / 60 / 24)} days ago`;
      } else if (minutesSinceLastLogin >= (60 * 24 * 30) && minutesSinceLastLogin < (60 * 24 * 30 * 2)) {
        lastActive = '1 month ago';
      } else if (minutesSinceLastLogin >= (60 * 24 * 30 * 2) && minutesSinceLastLogin < (60 * 24 * 30 * 12)) {
        lastActive = `${Math.floor(minutesSinceLastLogin / 60 / 24 / 30)} months ago`;
      } else {
        lastActive = '12+ months ago';
      }

      res.render('layouts/app/index', {
        locals: {
          title: 'My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
            '/static/client/views/partials/styles/app-nav.css',
            '/static/client/views/layouts/app/app-global-styles.css',
            '/static/client/views/app/profile/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/layouts/app/handleLogout.js',
            '/static/client/views/app/profile/main.js',
          ],
          authUser,
          lastActive,
          user,
        },
        partials: {
          nav: 'partials/app-nav',
          body: 'app/profile/index',
        },
      });
    }
  })
})

module.exports = router;
