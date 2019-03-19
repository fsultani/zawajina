import layout from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import welcome from './views/welcome.js';
import login from './views/login.js';
import memberProfile from './views/memberProfile.js';

// const bootstrapCss = document.createElement('link');
// const fontAwesomeCss = document.createElement('link');
// const materialCss = document.createElement('link');
// const animateCss = document.createElement('link');
// const hamburgersCss = document.createElement('link');
// const animsitionCss = document.createElement('link');
// const select2Css = document.createElement('link');
// const daterangepickerCss = document.createElement('link');
// const utilCss = document.createElement('link');
// const mainCss = document.createElement('link');

const loginPageCss = () => {
  let bootstrapCss;
  let fontAwesomeCss;
  let materialCss;
  let animateCss;
  let hamburgersCss;
  let animsitionCss;
  let select2Css;
  let daterangepickerCss;
  let utilCss;
  let mainCss;

  const loginPageCssLinks = []
  const loginPageCssHrefs = [
    {
      href: "/static/css/bootstrap.min.css"
    },
    {
      href: "/static/css/font-awesome.min.css"
    },
    {
      href: "/static/material-design-iconic-font.min.css"
    },
    {
      href: "/static/css/animate.css"
    },
    {
      href: "/static/css/hamburgers.min.css"
    },
    {
      href: "/static/css/animsition.min.css"
    },
    {
      href: "/static/css/select2.min.css"
    },
    {
      href: "/static/css/daterangepicker.css"
    },
    {
      href: "/static/css/util.css"
    },
    {
      href: "/static/css/main.css"
    }
  ]

  loginPageCssLinks.push(
    bootstrapCss,
    fontAwesomeCss,
    materialCss,
    animateCss,
    hamburgersCss,
    animsitionCss,
    select2Css,
    daterangepickerCss,
    utilCss,
    mainCss
  )

  loginPageCssLinks.map((element, index) => {
    element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = loginPageCssHrefs[index].href
    document.head.appendChild(element)
  })
}

window.onload = () => {
  const doc = document
  const rootEl = doc.documentElement
  const body = doc.body
  /* global ScrollReveal */
  const sr = window.sr = ScrollReveal({ mobile: false })

  rootEl.classList.remove('no-js')
  rootEl.classList.add('js')

  body.classList.add('is-loaded')

  // Reveal animations
  function revealAnimations () {
    sr.reveal('.features .section-title, .features-illustration, .feature', {
      delay: 300,
      duration: 600,
      distance: '60px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'bottom',
      viewFactor: 0.2,
      interval: 150
    })
    sr.reveal('.feature-extended:nth-child(odd) .feature-extended-body, .feature-extended:nth-child(even) .feature-extended-image', {
      duration: 600,
      distance: '40px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'right',
      viewFactor: 0.5
    })
    sr.reveal('.feature-extended:nth-child(even) .feature-extended-body, .feature-extended:nth-child(odd) .feature-extended-image', {
      duration: 600,
      distance: '40px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'left',
      viewFactor: 0.5
    })
    sr.reveal('.pricing-table, .testimonial, .cta-inner', {
      duration: 600,
      distance: '60px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'bottom',
      viewFactor: 0.5,
      interval: 150
    })
  }

  axios.defaults.headers.common['authorization'] = Cookies.get('token')
  let { pathname } = window.location;

  const loginScript = document.createElement('script');
  loginScript.src = '/static/js/scripts/Login.js';
  document.head.appendChild(loginScript);

  const logoutScript = document.createElement('script');
  logoutScript.src = '/static/js/scripts/Logout.js';
  document.head.appendChild(logoutScript);

  if (Cookies.get('token')) {
    if (!window.history.state) {
      window.history.replaceState({ page: 'home'}, null, '/');
      layout();
    } else {
      if (window.history.state.page) {
        const { page } = window.history.state
        if (page.startsWith('userId')) {
          const memberId = window.location.pathname.split('/')[2]
          window.history.replaceState({ page: `userId=${memberId}`}, null, window.location.pathname);
          layout() + memberProfile(memberId);
        } else {
          window.history.replaceState({ page: 'home'}, null, '/');
          layout();
        }
      }
    }
  } else {
    if (window.history.state && window.history.state.page) {
      const { page } = window.history.state
      if (page === 'home') {
        window.history.replaceState({ page: 'home'}, null, '/');
        layout();
      } else if (page === 'login') {
        loginPageCss();
        window.history.replaceState({ page: 'login'}, null, '/login');
        login();
        // setTimeout(() => {
        // }, 100)
      } else if (page === 'register') {
        window.history.replaceState({ page: 'register'}, null, '/register');
        document.getElementById('app').innerHTML = layout() + personalInfo;
      } else {
        window.history.replaceState({ page: 'home'}, null, '/');
        layout();
      }
    } else {
      window.history.replaceState({ page: 'home'}, null, '/home');
      layout();
    }
  }

  window.addEventListener('popstate', event => {
    if (!event.state) {
      event.preventDefault()
      return false;
    }
    const { page } = event.state
    console.log("page\n", page)
    if (page === 'home') {
      window.history.replaceState({ page: 'home'}, null, '/');
      layout();
    } else if (page === 'login') {
      loginPageCss();
        window.history.replaceState({ page: 'login'}, null, '/login');
        document.getElementById('app').innerHTML = login();
    } else if (page === 'register') {
      window.history.replaceState({ page: 'register'}, null, '/register');
      document.getElementById('app').innerHTML = layout() + personalInfo;
    } else if (page.startsWith('userId')) {
      const memberId = window.location.pathname.split('/').slice(1)[1]
      window.history.replaceState({ page: `userId=${memberId}`}, null, window.location.pathname);
      layout() + memberProfile(memberId);
    }
  })

  window.addEventListener('hashchange', event => {
    event.preventDefault();
    const { hash } = window.location;
    if (hash === '#home') {
      window.history.replaceState({ page: 'home'}, null, '/');
      layout();
    } else if (hash === '#login') {
      // loginPageCss();
      // let bootstrapCss;
      // let fontAwesomeCss;
      // let materialCss;
      // let animateCss;
      // let hamburgersCss;
      // let animsitionCss;
      // let select2Css;
      // let daterangepickerCss;
      // let utilCss;
      // let mainCss;

      // const loginPageCssLinks = []
      // const loginPageCssHrefs = [
      //   {
      //     href: "/static/css/bootstrap.min.css"
      //   },
      //   {
      //     href: "/static/css/font-awesome.min.css"
      //   },
      //   {
      //     href: "/static/material-design-iconic-font.min.css"
      //   },
      //   {
      //     href: "/static/css/animate.css"
      //   },
      //   {
      //     href: "/static/css/hamburgers.min.css"
      //   },
      //   {
      //     href: "/static/css/animsition.min.css"
      //   },
      //   {
      //     href: "/static/css/select2.min.css"
      //   },
      //   {
      //     href: "/static/css/daterangepicker.css"
      //   },
      //   {
      //     href: "/static/css/util.css"
      //   },
      //   {
      //     href: "/static/css/main.css"
      //   }
      // ]

      // loginPageCssLinks.push(
      //   bootstrapCss,
      //   fontAwesomeCss,
      //   materialCss,
      //   animateCss,
      //   hamburgersCss,
      //   animsitionCss,
      //   select2Css,
      //   daterangepickerCss,
      //   utilCss,
      //   mainCss
      // )

      // loginPageCssLinks.map((element, index) => {
      //   element = document.createElement('link')
      //   element.rel = "stylesheet"
      //   element.href = loginPageCssHrefs[index].href
      //   document.head.appendChild(element)
      // })

      const link1 = document.createElement('link')
      link1.rel = 'stylesheet'
      link1.href = "/static/css/bootstrap.min.css"
      document.head.appendChild(link1)

      const link2 = document.createElement('link')
      link2.rel = 'stylesheet'
      link2.href = "/static/css/font-awesome.min.css"
      document.head.appendChild(link2)

      const link3 = document.createElement('link')
      link3.rel = 'stylesheet'
      link3.href = "/static/material-design-iconic-font.min.css"
      document.head.appendChild(link3)

      const link4 = document.createElement('link')
      link4.rel = 'stylesheet'
      link4.href = "/static/css/animate.css"
      document.head.appendChild(link4)

      const link5 = document.createElement('link')
      link5.rel = 'stylesheet'
      link5.href = "/static/css/hamburgers.min.css"
      document.head.appendChild(link5)

      const link6 = document.createElement('link')
      link6.rel = 'stylesheet'
      link6.href = "/static/css/animsition.min.css"
      document.head.appendChild(link6)

      const link7 = document.createElement('link')
      link7.rel = 'stylesheet'
      link7.href = "/static/css/select2.min.css"
      document.head.appendChild(link7)

      const link8 = document.createElement('link')
      link8.rel = 'stylesheet'
      link8.href = "/static/css/daterangepicker.css"
      document.head.appendChild(link8)

      const link9 = document.createElement('link')
      link9.rel = 'stylesheet'
      link9.href = "/static/css/util.css"
      document.head.appendChild(link9)

      const link10 = document.createElement('link')
      link10.rel = 'stylesheet'
      link10.href = "/static/css/main.css"
      document.head.appendChild(link10)
      // debugger;

      window.history.replaceState({ page: 'login'}, null, '/login');
      // document.getElementById('app').innerHTML = login();
      login();
      document.getElementById('loginPage').style.display = 'flex'

    } else if (hash === '#register') {
      window.history.replaceState({ page: 'register'}, null, '/register');
      document.getElementById('app').innerHTML = layout() + personalInfo;
    } else if (hash.startsWith('#users')) {
      const memberId = window.location.hash.split('/')[1]
      window.history.replaceState({ page: `userId=${memberId}`}, null, hash.slice(1));
      layout() + memberProfile(memberId);
    }
  })
  if (body.classList.contains('has-animations')) {
    revealAnimations()
  }
}
