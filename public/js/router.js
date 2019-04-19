import Home from './pages/Home/index.js';
import { personalInfoCss, PersonalInfo } from './pages/Register/PersonalInfo/index.js';
import welcome from './pages/welcome.js';
import { removeNonLoginCss, loginPageCss, Login } from './pages/Login/index.js';
import memberProfile from './pages/memberProfile.js';

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
  loginScript.src = '/static/js/pages/Login/handleLogin.js';
  document.head.appendChild(loginScript);

  const logoutScript = document.createElement('script');
  logoutScript.src = '/static/js/pages/Logout/handleLogout.js';
  document.head.appendChild(logoutScript);

  if (Cookies.get('token')) {
    if (!window.history.state) {
      window.history.replaceState({ page: 'home'}, null, '/');
      Home();
    } else {
      if (window.history.state.page) {
        const { page } = window.history.state
        window.history.replaceState({ page: 'home'}, null, '/');
        Home();
      }
    }
  } else {
    // First page load
    if (window.history.state && window.history.state.page) {
      const { page } = window.history.state
      if (page === 'home') {
        window.history.replaceState({ page: 'home'}, null, '/');
        Home();
      } else if (page === 'login') {
        window.history.replaceState({ page: 'login'}, null, '/login');
        Login();
      } else if (page === 'register') {
        window.history.replaceState({ page: 'register'}, null, '/register');
        PersonalInfo();
      } else {
        window.history.replaceState({ page: 'home'}, null, '/');
        Home();
      }
    } else {
      window.history.replaceState({ page: 'home'}, null, '/home');
      Home();
    }
  }

  window.addEventListener('popstate', event => {
    if (!event.state) {
      event.preventDefault()
      return false;
    }
    const { page } = event.state
    if (page === 'home') {
      window.history.replaceState({ page: 'home'}, null, '/');
      Home();
    } else if (page === 'login') {
      window.history.replaceState({ page: 'login'}, null, '/login');
      Login();
    } else if (page === 'register') {
      window.history.replaceState({ page: 'register'}, null, '/register');
    }
  })

  window.addEventListener('hashchange', event => {
    event.preventDefault();
    const { hash } = window.location;
    if (hash === '#home') {
      window.history.replaceState({ page: 'home'}, null, '/');
      Home();
    } else if (hash === '#login') {
      window.history.replaceState({ page: 'login'}, null, '/login');
      Login();
    } else if (hash === '#register') {
      window.history.replaceState({ page: 'register'}, null, '/register');
      PersonalInfo();
    }
  })

  if (body.classList.contains('has-animations')) {
    revealAnimations()
  }
}
