module.exports.signupPage = res => res.render('landing-pages/_layouts/index', {
  locals: {
    title: 'Sign Up - My Match',
    styles: [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
      '/static/client/views/landing-pages/_layouts/global-styles.css',
      '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
      '/static/client/views/landing-pages/_partials/styles/footer.css',
      '/static/client/views/landing-pages/signup/styles.css',
    ],
    scripts: [
      '/static/assets/apis/axios.min.js',
      '/static/assets/apis/js.cookie.min.js',
      '/static/client/views/landing-pages/signup/js/includeHTML.js',
      '/static/client/views/landing-pages/signup/js/togglePassword.js',
      '/static/client/views/landing-pages/signup/js/handleSignupStepOne.js',
    ],
  },
  partials: {
    nav: 'landing-pages/_partials/landing-page-nav',
    body: 'landing-pages/signup/index',
    footer: 'landing-pages/_partials/footer',
  },
});
