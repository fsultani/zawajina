const staticRoutes = ({ requestUrl, my_match_userId }) => {
  console.log(`requestUrl\n`, requestUrl);
  switch (requestUrl) {
    case '/':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'My Match',
          styles: [
            'https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/home/styles.css',
          ],
          scripts: [
            'https://unpkg.com/scrollreveal',
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            '/static/client/views/landing-pages/home/animations.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/home/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/about':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'About Us - My Match',
          styles: [
            'https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/about/styles.css',
          ],
          scripts: [
            'https://unpkg.com/scrollreveal@4.0.5/dist/scrollreveal.min.js',
            '/static/client/views/landing-pages/home/animations.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/about/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/login':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Login - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css',
            'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/login/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/login/handleFocusEvent.js',
            '/static/client/views/landing-pages/login/handleLogin.js',
            '/static/client/views/landing-pages/login/init.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/login/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/signup':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/signup/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
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
      break;
    case '/verify-email':
      /* If someone lands on this pathname without a my_match_userId, redirect them to /signup. */
      if (!my_match_userId) return res.redirect('/signup');
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/verify-email/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
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
      break;
    case '/resend-email':
      /* If someone lands on this pathname without a my_match_userId, redirect them to /signup. */
      if (!my_match_userId) return res.redirect('/signup');
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/resend-email/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/resend-email/js/includeHTML.js',
            '/static/client/views/landing-pages/resend-email/js/handleResendVerificationCode.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/resend-email/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/signup/profile':
      /* If someone lands on this pathname without a my_match_userId, redirect them to /signup. */
      if (!my_match_userId) return res.redirect('/signup');
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Sign Up - My Match',
          styles: [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/signup-profile/styles.css',
          ],
          scripts: [
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/utils.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/dobHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/locationHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/raisedHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/ethnicityHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/professionHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/languageHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/helpers/hobbiesHelper.js',
            '/static/client/views/landing-pages/signup-profile/js/signupProfileInit.js',
            '/static/client/views/landing-pages/signup-profile/js/handleCreateNewAccount.js',
            '/static/client/views/landing-pages/signup-profile/js/imageUpload.js',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/signup-profile/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    case '/terms':
      res.render('landing-pages/_layouts/index', {
        locals: {
          title: 'Terms of Service - My Match',
          styles: [
            'https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700',
            '/static/client/views/landing-pages/_layouts/global-styles.css',
            '/static/client/views/landing-pages/_partials/styles/landing-page-nav.css',
            '/static/client/views/landing-pages/_partials/styles/footer.css',
            '/static/client/views/landing-pages/terms/styles.css',
          ],
        },
        partials: {
          nav: 'landing-pages/_partials/landing-page-nav',
          body: 'landing-pages/terms/index',
          footer: 'landing-pages/_partials/footer',
        },
      });
      break;
    default:
      res.redirect('/login');
  }
}

module.exports = staticRoutes;
