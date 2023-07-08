const express = require('express');

const { getAllFiles, redirectToLogin } = require('../../utils');
const { usersCollection } = require('../../db');

const router = express.Router();

router.get('/account', async (req, res) => {
  try {
    const { authUser, allConversationsCount } = req;

    const directoryPath = ['client/views/app/settings/account'];

    const stylesArray = [
      '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
      '/static/client/views/app/_partials/app-nav.css',
      '/static/client/views/app/settings/styles.css',
    ];

    const scriptsArray = [
      '/static/assets/apis/axios.min.js',
      '/static/assets/apis/js.cookie.min.js',
      '/static/client/views/app/settings/script.js',
      '/static/client/views/app/settings/account/handleUpdateAccount.js',
    ];

    const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
    const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

    res.render('app/_layouts/index', {
      locals: {
        title: 'My Match',
        styles,
        scripts,
        authUser,
        allConversationsCount,
      },
      partials: {
        nav: 'app/_partials/app-nav',
        body: 'app/settings/account/index',
      },
    });
  } catch (error) {
    redirectToLogin(error, res);
  }
});

router.get('/blocked', async (req, res) => {
  try {
    const { authUser, allConversationsCount } = req;
    const originalUrl = req.originalUrl.split('?')[0];
    const page = parseInt(req.query.page) || 1;
    const skipRecords = page > 1 ? (page - 1) * 20 : 0;
    const blockedUsers = authUser.blockedUsers;

    const findQuery = {
      _id: {
        $in: blockedUsers,
      },
      gender: authUser.gender === 'male' ? 'female' : 'male',
    }

    const allUsersCount = await usersCollection()
      .find(findQuery)
      .count();

    let allUsers = await usersCollection()
      .find(findQuery)
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

    const numberOfPages = Math.ceil(allUsersCount / 20) || 1;
    const currentPage = page || 1;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < numberOfPages ? currentPage + 1 : null;

    const directoryPath = ['client/views/app/settings/blocked-users'];

    const stylesArray = [
      '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
      '/static/client/views/app/_partials/app-nav.css',
      '/static/client/views/app/_layouts/app-global-styles.css',
      '/static/client/views/app/settings/styles.css',
    ];

    const scriptsArray = [
      '/static/assets/apis/axios.min.js',
      '/static/assets/apis/js.cookie.min.js',
      '/static/client/views/app/settings/script.js',
    ];

    const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
    const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

    if (currentPage <= numberOfPages) {
      res.render('app/_layouts/index', {
        locals: {
          title: 'My Match',
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
          body: 'app/settings/blocked-users/index',
        },
      });
    } else {
      res.redirect(`/settings/blocked`);
    }
  } catch (error) {
    redirectToLogin(error, res);
  }
});

router.get('/password', async (req, res) => {
  try {
    const { authUser, allConversationsCount } = req;
    const authUserId = authUser._id.toString();
    const page = parseInt(req.query.page);
    const skipRecords = page > 1 ? (page - 1) * 20 : 0;

    const allUsersCount = await usersCollection()
      .find({ gender: authUser.gender === 'male' ? 'female' : 'male' })
      .count();

    let likeFilter = { likedByUsers: { $in: [authUserId] } }
    if (req.originalUrl === '/likes-me') {
      likeFilter = { usersLiked: { $in: [authUserId] } }
    }

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

    const directoryPath = ['client/views/app/settings/password'];

    const stylesArray = [
      '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
      '/static/client/views/app/_partials/app-nav.css',
      '/static/client/views/app/_layouts/app-global-styles.css',
      '/static/client/views/app/settings/styles.css',
    ];

    const scriptsArray = [
      '/static/assets/apis/axios.min.js',
      '/static/assets/apis/js.cookie.min.js',
      '/static/client/views/app/settings/script.js',
    ];

    const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
    const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

    if (currentPage <= numberOfPages) {
      res.render('app/_layouts/index', {
        locals: {
          title: 'My Match',
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
        },
        partials: {
          nav: 'app/_partials/app-nav',
          body: 'app/settings/password/index',
        },
      });
    } else if (numberOfPages === 0) {
      res.render('app/_layouts/index', {
        locals: {
          title: 'My Match',
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
        },
        partials: {
          nav: 'app/_partials/app-nav',
          body: 'app/settings/password/index',
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
