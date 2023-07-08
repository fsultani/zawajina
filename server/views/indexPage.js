module.exports.indexPage = res => res.render('landing-pages/_layouts/index', {
  locals: {
    title: 'My Match',
    styles: [
      '/static/assets/styles/fonts_googleapis.css',
      '/static/client/views/landing-pages/_layouts/global-styles.css',
      '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
      '/static/client/views/landing-pages/_partials/styles/footer.css',
      '/static/client/views/landing-pages/home/styles.css',
    ],
    scripts: [
      'https://unpkg.com/scrollreveal',
      '/static/assets/apis/axios.min.js',
      '/static/client/views/landing-pages/home/animations.js',
    ],
  },
  partials: {
    nav: 'landing-pages/_partials/landing-page-nav',
    body: 'landing-pages/home/index',
    footer: 'landing-pages/_partials/footer',
  },
});
