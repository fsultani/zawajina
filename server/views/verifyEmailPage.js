module.exports.verifyEmailPage = res => res.render('landing-pages/_layouts/index', {
  locals: {
    title: 'Sign Up - Zawajina',
    styles: [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
      '/static/client/views/landing-pages/_layouts/global-styles.css',
      '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
      '/static/client/views/landing-pages/_partials/styles/footer.css',
      '/static/client/views/landing-pages/verify-email/styles.css',
    ],
    scripts: [
      '/static/client/views/landing-pages/verify-email/init.js',
      '/static/client/views/landing-pages/verify-email/handleVerityEmail.js',
    ],
  },
  partials: {
    nav: 'landing-pages/_partials/landing-page-nav',
    body: 'landing-pages/verify-email/index',
    footer: 'landing-pages/_partials/footer',
  },
});
