const express = require('express');

const { usersCollection } = require('../db.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { authUser, allConversationsCount } = req;
    const page = parseInt(req.query.page);
    const skipRecords = page > 1 ? (page - 1) * 20 : 0;

    const allUsersCount = await usersCollection()
      .find({ gender: authUser.gender === 'male' ? 'female' : 'male' })
      .count();

    let allUsers = await usersCollection()
      .find({ gender: authUser.gender === 'male' ? 'female' : 'male' })
      .sort({ 'loginData.time': -1 })
      .skip(skipRecords)
      .limit(20)
      .toArray();

    allUsers = allUsers.map(user => {
      const userPHotos = user.photos.map(photo => photo.secure_url)
      return {
        ...user,
        photos: userPHotos,
      }
    })

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
            '/static/assets/apis/axios.min.js',
            '/static/assets/apis/js.cookie.min.js',
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
            '/static/assets/apis/axios.min.js',
            '/static/assets/apis/js.cookie.min.js',
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
