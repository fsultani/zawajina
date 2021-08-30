const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const { authUser, allConversationsCount } = req;

  res.render('app/_layouts/index', {
    locals: {
      title: 'My Match',
      styles: [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
        '/static/client/views/app/_partials/app-nav.css',
        '/static/client/views/app/_layouts/app-global-styles.css',
        '/static/client/views/app/search/styles.css',
      ],
      scripts: [
        'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
        'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
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
