const { getAllFiles } = require("../utils");

module.exports.loginPage = res => {
  const directoryPath = ['client/views/landing-pages/login'];

  const stylesArray = [
    '/static/assets/styles/material-design-iconic-font.min.css',
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

  return res.render('landing-pages/_layouts/index', {
    locals: {
      title: 'Login - My Match',
      styles,
      scripts,
    },
    partials: {
      nav: 'landing-pages/_partials/landing-page-nav',
      body: 'landing-pages/login/index',
      footer: 'landing-pages/_partials/footer',
    },
  });
};
