const axios = require('axios');
const express = require('express');

const { getLastActive, calculateImperialHeight } = require('./utils.js');
const { getAllFiles, redirectToLogin, camelCaseToTitleCase } = require('../../utils');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let { authUser, allConversationsCount } = req;
    const userId = authUser._id;

    const validPhotos = await Promise.all(authUser.photos.map(async photo => {
      const photoUrl = photo?.secure_url;

      try {
        await axios.get(photoUrl)
        return photo;
      } catch (error) {
        console.log(`error - server/routes/user/profile.js:28\n`, error);
      }
    }))

    const photos = validPhotos.filter(photo => photo).filter(photo => {
      const photoHasIndex = !isNaN(photo.index);
      const photoHasPublicId = photo.public_id?.length > 0;
      const photoHasSecureUrl = photo.secure_url?.length > 0;
      const photoHasApprovedField = photo.approvalStatus?.length > 0;

      return photoHasIndex && photoHasPublicId && photoHasSecureUrl && photoHasApprovedField;
    })

    authUser = {
      ...authUser,
      photos,
    };

    const imperialHeight = calculateImperialHeight(authUser.height);
    const userHeight = `${imperialHeight.heightInFeet}'${imperialHeight.heightInInches}" (${authUser.height} cm)`;

    authUser = {
      ...authUser,
      height: userHeight,
    };

    const hijab = authUser.hijab ? camelCaseToTitleCase(authUser.hijab).split(' ')[1] : null;
    const hasChildren = camelCaseToTitleCase(authUser.hasChildren).split(' ')[2];
    const wantsChildren = camelCaseToTitleCase(authUser.wantsChildren).split(' ')[2];
    const canRelocate = camelCaseToTitleCase(authUser.canRelocate).split(' ').slice(2).map((word, index) => index > 0 ? word.toLowerCase() : word).join(', ');
    const smokes = camelCaseToTitleCase(authUser.smokes).split(' ')[1];

    authUser = {
      ...authUser,
      hasChildren,
      wantsChildren,
      canRelocate,
      smokes,
      hijab,
    };

    const lastActive = await getLastActive(userId);

    const directoryPath = ['client/views/app/profile'];

    const stylesArray = [
      '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
      '/static/client/views/app/_partials/app-nav.css',
    ];

    const scriptsArray = [];

    const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
    const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

    res.render('app/_layouts/index', {
      locals: {
        title: 'Zawajina',
        styles,
        scripts,
        authUser,
        allConversationsCount,
        lastActive,
      },
      partials: {
        nav: 'app/_partials/app-nav',
        body: 'app/profile/auth-user-profile',
      },
    });
  } catch (error) {
    redirectToLogin(error, res);
  }
});

module.exports = router;
