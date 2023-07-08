const express = require('express');
const { getAllFiles } = require('../../utils.js');

const router = express.Router();

router.get('/request', (_req, res) => {
  const directoryPath = ['client/views/landing-pages/password/forgot-password'];

  const stylesArray = [
    '/static/assets/styles/material-design-iconic-font.min.css',
    '/static/assets/styles/bootstrap.min.css',
    '/static/client/views/landing-pages/_layouts/global-styles.css',
    '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
    '/static/client/views/landing-pages/_partials/styles/footer.css',
  ];

  const scriptsArray = [
    '/static/assets/apis/axios.min.js',
    '/static/assets/apis/js.cookie.min.js',
  ];

  const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
  const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

  res.render('landing-pages/_layouts/index', {
    locals: {
      title: 'Login - My Match',
      styles,
      scripts,
    },
    partials: {
      nav: 'landing-pages/_partials/landing-page-nav',
      body: 'landing-pages/password/forgot-password/index',
      footer: 'landing-pages/_partials/footer',
    },
  });
});

router.get('/reset', (_req, res) => {
  const directoryPath = ['client/views/landing-pages/password/reset-password'];

  const stylesArray = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
    '/static/client/views/landing-pages/_layouts/global-styles.css',
    '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
    '/static/client/views/landing-pages/_partials/styles/footer.css',
  ];

  const scriptsArray = [
    '/static/assets/apis/axios.min.js',
    '/static/assets/apis/js.cookie.min.js',
  ];

  const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
  const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

  res.render('landing-pages/_layouts/index', {
    locals: {
      title: 'Login - My Match',
      styles,
      scripts,
    },
    partials: {
      nav: 'landing-pages/_partials/landing-page-nav',
      body: 'landing-pages/password/reset-password/index',
      footer: 'landing-pages/_partials/footer',
    },
  });
});

module.exports = router;
