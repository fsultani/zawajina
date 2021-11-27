const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const { authUser, allConversationsCount } = req;

  res.render('app/_layouts/index', {
    locals: {
      title: 'My Match',
      styles: [
        '/static/assets/font_awesome_5_14_0.min.css',
        '/static/client/views/app/_partials/app-nav.css',
        '/static/client/views/app/_layouts/app-global-styles.css',
        '/static/client/views/app/search/styles.css',
      ],
      scripts: [
        '/static/assets/axios.min.js',
        '/static/assets/js.cookie.min.js',
      ],
      authUser,
      allConversationsCount,
    },
    partials: {
      nav: 'app/_partials/app-nav',
      body: 'app/search/index',
    },
  });
});

module.exports = router;
