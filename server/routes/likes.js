const express = require('express');
const { getAllFiles, redirectToLogin } = require('../utils');
const { usersCollection } = require('../db.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const validRoutes = ['/likes', '/likes-me'];
    const originalUrl = req.originalUrl.split('?')[0];
    if (validRoutes.indexOf(originalUrl) === -1) return res.redirect('/users');

    const { authUser, allConversationsCount } = req;
    const page = parseInt(req.query.page) || 1;
    const skipRecords = page > 1 ? (page - 1) * 20 : 0;

    const likeFilter = {
      _id: {
        $in: originalUrl === '/likes' ? authUser.usersLiked : authUser.likedByUsers,
      }
    }

    const allUsersCount = await usersCollection()
      .find(likeFilter)
      .count();

    let allUsers = await usersCollection()
      .find(likeFilter)
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

    const directoryPath = ['client/views/app/likes'];

    const stylesArray = [
      '/static/client/views/app/likes/styles.css',
      '/static/client/views/app/_partials/app-nav.css',
    ];

    const scriptsArray = [];

    const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
    const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

    if (currentPage <= numberOfPages) {
      res.render('app/_layouts/index', {
        locals: {
          title: 'Zawajina',
          styles,
          scripts,
          authUser,
          allConversationsCount,
          allUsersCount,
          allUsers,
          previousPage,
          numberOfPages,
          currentPage,
          nextPage,
          originalUrl,
        },
        partials: {
          nav: 'app/_partials/app-nav',
          body: 'app/likes/index',
        },
      });
    } else if (numberOfPages === 0) {
      res.render('app/_layouts/index', {
        locals: {
          title: 'Zawajina',
          styles,
          scripts,
          authUser,
          allConversationsCount,
          allUsersCount: 0,
          allUsers: [],
          previousPage: 0,
          numberOfPages: 1,
          currentPage: 1,
          nextPage,
          originalUrl,
        },
        partials: {
          nav: 'app/_partials/app-nav',
          body: 'app/likes/index',
        },
      });
    } else {
      res.redirect(`/users?page=${numberOfPages}`);
    }
  } catch (error) {
    redirectToLogin(error, res);
  }
});

module.exports = router;
