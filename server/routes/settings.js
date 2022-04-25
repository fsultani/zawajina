const express = require('express');
const { getAllFiles } = require('../utils');

const router = express.Router();

router.get('/:route?', async (req, res) => {
  try {
    const { route } = req.params;
    const validRoutes = ['profile', 'account', 'security', 'notification', 'billing']
    if (validRoutes.indexOf(route) === -1) return res.redirect('/settings/profile');

    const { authUser, allConversationsCount } = req;
    const stylesDirectoryPath = ['client/views/app/settings'];
    const scriptsDirectoryPath = ['client/views/app/settings/js', 'client/views/app/settings/js/helpers'];

    const styles = [
      '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
      '/static/client/views/app/_partials/app-nav.css',
      '/static/client/views/app/_layouts/app-global-styles.css'
    ];

    const scripts = [
      '/static/assets/apis/axios.min.js',
      '/static/assets/apis/js.cookie.min.js',
    ];

    const allStyles = getAllFiles({ directoryPath: stylesDirectoryPath, fileType: 'css', filesArray: styles });
    const allScripts = getAllFiles({ directoryPath: scriptsDirectoryPath, fileType: 'js', filesArray: scripts });

    if (route === 'account') {
      allStyles.push('/static/client/views/app/settings/css/account.css')
    }

    res.render('app/_layouts/index', {
      locals: {
        title: 'My Match',
        styles: allStyles,
        scripts: allScripts,
        authUser,
        allConversationsCount,
        route: req.params.route,
      },
      partials: {
        nav: 'app/_partials/app-nav',
        body: 'app/settings/index',
      },
    });
  } catch (error) {
    console.log(`error\n`, error);
    res.redirect('/login')
  }
});

module.exports = router;
