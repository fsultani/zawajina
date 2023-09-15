const { getAllFiles } = require("../utils");

module.exports.signupProfilePage = res => {
  const directoryPath = ['client/views/landing-pages/signup-profile'];

  const stylesArray = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
    '/static/client/views/landing-pages/_layouts/global-styles.css',
    '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
    '/static/client/views/landing-pages/_partials/styles/footer.css',
  ];

  const scriptsArray = [];

  const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
  const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

  /* Move the init.js file to the beginning of the array, after the axios and js.cookie imports, since init.js uses axios */ 
  const initFileIndex = scripts.findIndex(file => {
    const isInitFile = file.split('/').indexOf('init.js') > -1;
    if (isInitFile) return isInitFile;
  });

  const initFile = scripts.splice(initFileIndex, 1)[0];
  scripts.splice(2, 0, initFile);

  /* Move the main.js file to the end of the array to make the api calls last */
  const mainFileIndex = scripts.findIndex(file => {
    const isMainFile = file.split('/').indexOf('main.js') > -1;
    if (isMainFile) return isMainFile;
  });

  const mainFile = scripts.splice(mainFileIndex, 1)[0];
  scripts.splice(scripts.length, 0, mainFile);

  return res.render('landing-pages/_layouts/index', {
    locals: {
      title: 'Sign Up - Zawajina',
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
