const { getAllFiles } = require("../utils");

module.exports.signupProfilePage = res => {
  const directoryPath = ['client/views/landing-pages/signup-profile'];

  const stylesArray = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
    '/static/client/views/landing-pages/_layouts/global-styles.css',
    '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
    '/static/client/views/landing-pages/_partials/styles/footer.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
  ];

  const scriptsArray = [
    '/static/assets/apis/axios.min.js',
    '/static/assets/apis/js.cookie.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',
  ];

  /* Move the init.js file to the beginning of the array, after the axios and js.cookie imports, since init.js uses axios */
  const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
  const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

  // const scriptsArray = getAllFiles({ directoryPath: scriptsDirectoryPath, fileType: 'js', filesArray: scripts });
  const initFileIndex = scripts.findIndex(file => {
    const isInitFile = file.split('/').indexOf('init.js') > -1;
    if (isInitFile) return isInitFile;
  });

  const element = scripts.splice(initFileIndex, 1)[0];
  scripts.splice(2, 0, element);

  return res.render('landing-pages/_layouts/index', {
    locals: {
      title: 'Sign Up - My Match',
      styles,
      scripts,
    },
    partials: {
      nav: 'landing-pages/_partials/landing-page-nav',
      body: 'landing-pages/signup-profile/index',
      footer: 'landing-pages/_partials/footer',
    },
  });
};
