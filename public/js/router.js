import layout from './pages/layout.js';
import { personalInfo } from './pages/register/personalInfo/index.js';
import PersonalInfoValidation from './pages/register/personalInfo/validations.js';
import HandleSignUp from './pages/register/personalInfo/handleSignUp.js';
import profileAbout from './pages/register/about/index.js';
import welcome from './pages/welcome.js';
import login from './pages/login.js';
import memberProfile from './pages/memberProfile.js';

const loginPageCss = () => {
  let bootstrapCss;
  let fontAwesomeCss;
  let animateCss;
  let hamburgersCss;
  let select2Css;
  let utilCss;
  let mainCss;

  const loginPageCssLinks = []
  const loginPageCssHrefs = [
    {
      href: "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    },
    {
      href: "/static/css/fonts/font-awesome-4.7.0/css/font-awesome.min.css"
    },
    {
      href: "/static/css/animate.css"
    },
    {
      href: "/static/css/hamburgers.min.css"
    },
    {
      href: "/static/css/select2.min.css"
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
    animateCss,
    hamburgersCss,
    select2Css,
    utilCss,
    mainCss
  )

  loginPageCssLinks.map((element, index) => {
    element = document.createElement('link')
    element.rel = "stylesheet"
    element.href = loginPageCssHrefs[index].href
    document.head.appendChild(element)
  })

  const bootstrapcdnScript = document.createElement('script')
  bootstrapcdnScript.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
  document.head.appendChild(bootstrapcdnScript)
}

const layoutCss = () => {
  const element = document.createElement('link')
  element.rel = "stylesheet"
  element.href = "/static/css/style.css"
  document.head.appendChild(element)
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
          layoutCss();
          revealAnimations()
          window.history.replaceState({ page: 'home'}, null, '/');
          layout();
        }
      }
    }
  } else {
    if (window.history.state && window.history.state.page) {
      const { page } = window.history.state
      if (page === 'home') {
        layoutCss();
        revealAnimations()
        window.history.replaceState({ page: 'home'}, null, '/');
        layout();
      } else if (page === 'login') {
        loginPageCss();
        window.history.replaceState({ page: 'login'}, null, '/login');
        login();
      } else if (page === 'register') {
        window.history.replaceState({ page: 'register'}, null, '/register');
        document.getElementById('app').innerHTML = layout() + personalInfo;
      } else {
        layoutCss();
        revealAnimations()
        window.history.replaceState({ page: 'home'}, null, '/');
        layout();
      }
    } else {
      layoutCss();
      revealAnimations()
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
      layoutCss();
      revealAnimations()
      window.history.replaceState({ page: 'home'}, null, '/');
      layout();
    } else if (page === 'login') {
      loginPageCss();
      window.history.replaceState({ page: 'login'}, null, '/login');
      login();
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
      layoutCss();
      revealAnimations()
      window.history.replaceState({ page: 'home'}, null, '/');
      layout();
    } else if (hash === '#login') {
      loginPageCss();
      window.history.replaceState({ page: 'login'}, null, '/login');
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
  revealAnimations()
  // if (body.classList.contains('has-animations')) {}
}
