module.exports.termsPage = res => res.render('landing-pages/_layouts/index', {
  locals: {
    title: 'Terms of Service - Zawajina',
    styles: [
      '/static/assets/styles/fonts_googleapis.css',
      '/static/client/views/landing-pages/_layouts/global-styles.css',
      '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
      '/static/client/views/landing-pages/_partials/styles/footer.css',
      '/static/client/views/landing-pages/terms/styles.css',
    ],
		scripts: [],
  },
  partials: {
    nav: 'landing-pages/_partials/landing-page-nav',
    body: 'landing-pages/terms/index',
    footer: 'landing-pages/_partials/footer',
  },
});
