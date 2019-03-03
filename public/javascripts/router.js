import layout from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import welcome from './views/welcome.js';
import login from './views/login.js';
import memberProfile from './views/memberProfile.js';

window.onload = () => {
  axios.defaults.headers.common['authorization'] = Cookies.get('token')
  let { pathname } = window.location;

  const loginScript = document.createElement('script');
  loginScript.src = '/static/javascripts/scripts/Login.js';
  document.head.appendChild(loginScript);

  const logoutScript = document.createElement('script');
  logoutScript.src = '/static/javascripts/scripts/Logout.js';
  document.head.appendChild(logoutScript);

  if (Cookies.get('token')) {
    if (!window.history.state) {
      window.history.replaceState({ page: 'home'}, null, '/');
      layout() + welcome();
    } else {
      if (window.history.state.page) {
        const { page } = window.history.state
        if (page.startsWith('userId')) {
          const memberId = window.location.pathname.split('/')[2]
          window.history.replaceState({ page: `userId=${memberId}`}, null, window.location.pathname);
          layout() + memberProfile(memberId);
        } else {
          window.history.replaceState({ page: 'home'}, null, '/');
          layout() + welcome();
        }
      }
    }
  } else {
    if (window.history.state && window.history.state.page) {
      const { page } = window.history.state
      if (page === 'home') {
        window.history.replaceState({ page: 'home'}, null, '/');
        layout() + welcome();
      } else if (page === 'login') {
        window.history.replaceState({ page: 'login'}, null, '/login');
        document.getElementById('app').innerHTML = layout() + login();
      } else if (page === 'register') {
        window.history.replaceState({ page: 'register'}, null, '/register');
        document.getElementById('app').innerHTML = layout() + personalInfo;
      } else {
        window.history.replaceState({ page: 'home'}, null, '/');
      }
    } else {
      window.history.replaceState({ page: 'home'}, null, '/home');
      document.getElementById('app').innerHTML = layout() + login();
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
      layout() + welcome();
    } else if (page === 'login') {
      window.history.replaceState({ page: 'login'}, null, '/login');
      document.getElementById('app').innerHTML = layout() + login();
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
      layout() + welcome();
    } else if (hash === '#login') {
      window.history.replaceState({ page: 'login'}, null, '/login');
      document.getElementById('app').innerHTML = layout() + login();
    } else if (hash === '#register') {
      window.history.replaceState({ page: 'register'}, null, '/register');
      document.getElementById('app').innerHTML = layout() + personalInfo;
    } else if (hash.startsWith('#users')) {
      const memberId = window.location.hash.split('/')[1]
      window.history.replaceState({ page: `userId=${memberId}`}, null, hash.slice(1));
      layout() + memberProfile(memberId);
    }
  })
}
