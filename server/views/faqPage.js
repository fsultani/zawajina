module.exports.faqPage = res => res.render('landing-pages/_layouts/index', {
  locals: {
    title: 'FAQ - My Match',
    styles: [
      '/static/assets/styles/fonts_googleapis.css',
      '/static/client/views/landing-pages/_layouts/global-styles.css',
      '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
      '/static/client/views/landing-pages/_partials/styles/footer.css',
      '/static/client/views/landing-pages/faq/styles.css',
    ],
    scripts: [
      '/static/client/views/landing-pages/faq/script.js'
    ],
  },
  partials: {
    nav: 'landing-pages/_partials/landing-page-nav',
    body: 'landing-pages/faq/index',
    footer: 'landing-pages/_partials/footer',
  },
});
