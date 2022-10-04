const bcrypt = require('bcryptjs');
const express = require('express');

const { getAllFiles } = require('../utils');
const { usersCollection, insertLogs } = require('../db.js');

const router = express.Router();

router.get('/account', async (req, res) => {
  try {
    const { authUser, allConversationsCount } = req;

    const directoryPath = ['client/views/app/settings/account'];
    const scriptsDirectoryPath = [`${directoryPath}/js`];

    const styles = [
      '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
      '/static/client/views/app/_partials/app-nav.css',
      '/static/client/views/app/_layouts/app-global-styles.css',
    ];

    const scripts = [
      '/static/assets/apis/axios.min.js',
      '/static/assets/apis/js.cookie.min.js',
      '/static/client/views/app/settings/index.js',
    ];

    const allStyles = getAllFiles({ directoryPath, fileType: 'css', filesArray: styles });
    const allScripts = getAllFiles({ directoryPath: scriptsDirectoryPath, fileType: 'js', filesArray: scripts });

    res.render('app/_layouts/index', {
      locals: {
        title: 'My Match',
        styles: allStyles,
        scripts: allScripts,
        authUser,
        allConversationsCount,
      },
      partials: {
        nav: 'app/_partials/app-nav',
        body: 'app/settings/account/index',
      },
    });
  } catch (error) {
    console.log(`error\n`, error);
    res.redirect('/login')
  }
});

router.put('/account', async (req, res) => {
  try {
    const { authUser, userIPAddress, endpoint, userId } = req;
    const { name, email, newUserPassword } = req.body;
    let response;
    let shouldUpdate = false;
    let update = {}

    if (name !== authUser.name) {
      shouldUpdate = true;
      update = {
        name,
      }
    }

    if (email !== authUser.email) {
      shouldUpdate = true;
      update = {
        ...update,
        email,
      }
    }

    if (newUserPassword) {
      const bcryptHash = await bcrypt.hash(newUserPassword, 10);
      const password = bcryptHash;
      shouldUpdate = true;
      update = {
        ...update,
        password,
      }
    }

    if (shouldUpdate) {
      response = await usersCollection().findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            ...update,
          },
        },
        {
          returnDocument: 'after',
          returnNewDocument: true,
        }
      )

      await insertLogs({
        ...update
      },
        userIPAddress,
        endpoint,
        userId
      );
    } else {
      response = {
        value: {
          ...authUser,
        }
      }
    }

    return res.status(200).json({
      name: response.value.name,
      email: response.value.email,
    });
  } catch (error) {
    console.log(`error\n`, error);
  }
});

// router.get('/:route?', async (req, res) => {
//   try {
//     const { route } = req.params;
//     const validRoutes = ['account', 'blocked', 'security']
//     if (validRoutes.indexOf(route) === -1) return res.redirect('/settings/account');

//     const { authUser, allConversationsCount } = req;
//     const authUserId = authUser._id.toString();
//     const page = parseInt(req.query.page);
//     const skipRecords = page > 1 ? (page - 1) * 20 : 0;

//     const allUsersCount = await usersCollection()
//       .find({ gender: authUser.gender === 'male' ? 'female' : 'male' })
//       .count();

//     let likeFilter = { likedByUsers: { $in: [authUserId] } }
//     if (req.originalUrl === '/likes-me') {
//       likeFilter = { usersLiked: { $in: [authUserId] } }
//     }

//     let allUsers = await usersCollection()
//       .find(likeFilter)
//       .sort({ 'loginData.time': -1 })
//       .skip(skipRecords)
//       .limit(20)
//       .toArray();

//     allUsers = allUsers.map(user => {
//       const userPHotos = user.photos.map(photo => photo.secure_url)
//       return {
//         ...user,
//         photos: userPHotos,
//       }
//     })

//     const numberOfPages = Math.ceil(allUsersCount / 20);
//     const currentPage = page || 1;
//     const previousPage = currentPage > 1 ? currentPage - 1 : null;
//     const nextPage = currentPage < numberOfPages ? currentPage + 1 : null;

//     const directoryPath = ['client/views/app/settings'];
//     const scriptsDirectoryPath = ['client/views/app/settings/js'];

//     const styles = [
//       '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
//       '/static/client/views/app/_partials/app-nav.css',
//       '/static/client/views/app/_layouts/app-global-styles.css'
//     ];

//     const scripts = [
//       '/static/assets/apis/axios.min.js',
//       '/static/assets/apis/js.cookie.min.js',
//     ];

//     const allStyles = getAllFiles({ directoryPath: directoryPath, fileType: 'css', filesArray: styles });
//     const allScripts = getAllFiles({ directoryPath: scriptsDirectoryPath, fileType: 'js', filesArray: scripts });

//     if (route === 'account') {
//       allStyles.push('/static/client/views/app/settings/css/account.css')
//     }

//     if (route === 'blocked') {
//       allStyles.push('/static/client/views/app/settings/css/blocked-users.css')
//     }

//     if (route === 'security') {
//       allStyles.push('/static/client/views/app/settings/css/security.css')
//     }

//     if (currentPage <= numberOfPages) {
//       res.render('app/_layouts/index', {
//         locals: {
//           title: 'My Match',
//           styles: allStyles,
//           scripts: allScripts,
//           authUser,
//           allConversationsCount,
//           allUsersCount,
//           allUsers,
//           previousPage,
//           numberOfPages,
//           currentPage,
//           nextPage,
//         },
//         partials: {
//           nav: 'app/_partials/app-nav',
//           body: 'app/settings/index',
//         },
//       });
//     } else if (numberOfPages === 0) {
//       res.render('app/_layouts/index', {
//         locals: {
//           title: 'My Match',
//           styles: allStyles,
//           scripts: allScripts,
//           authUser,
//           allConversationsCount,
//           allUsersCount: 0,
//           allUsers: [],
//           previousPage: 0,
//           numberOfPages: 1,
//           currentPage: 1,
//           nextPage,
//         },
//         partials: {
//           nav: 'app/_partials/app-nav',
//           body: 'app/settings/index',
//         },
//       });
//     } else {
//       res.redirect(`/users?page=${numberOfPages}`);
//     }
//   } catch (error) {
//     console.log(`error\n`, error);
//     res.redirect('/login')
//   }
// });

module.exports = router;
