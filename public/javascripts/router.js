import layout from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import welcome from './views/welcome.js';
import login from './views/login.js';
import memberProfile from './views/memberProfile.js';

const Router = () => {
  axios.defaults.headers.common['authorization'] = Cookies.get('token')
  let { pathname, hash } = window.location;

  const loginScript = document.createElement('script');
  loginScript.src = 'javascripts/scripts/Login.js';
  document.head.appendChild(loginScript);

  const logoutScript = document.createElement('script');
  logoutScript.src = 'javascripts/scripts/Logout.js';
  document.head.appendChild(logoutScript);

  if (Cookies.get('token') && window.history.state && window.history.state.page) {
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
    } else if (page.startsWith('userId')) {
      const url = window.location.hash.split('/')
      const memberId = window.location.hash.split('/')[1]
      window.history.replaceState({ page: `userId=${memberId}`}, null, hash);
      layout() + memberProfile(url, memberId);
    }
  } else {
    window.history.replaceState({ page: 'login'}, null, '/login');
    document.getElementById('app').innerHTML = layout() + login();
  }

  window.addEventListener('popstate', event => {
    if (!event.state) {
      event.preventDefault()
      return false;
    }
    const { page } = event.state
    const { hash } = window.location;
    if (page === 'home') {
      window.history.replaceState({ page: 'home'}, null, '/');
      layout() + welcome();
    } else if (page === 'login') {
      window.history.replaceState({ page: 'login'}, null, '/login');
      document.getElementById('app').innerHTML = layout() + login();
    } else if (page === 'register') {
      window.history.replaceState({ page: 'register'}, null, '/register');
      document.getElementById('app').innerHTML = layout() + personalInfo;
    } else if (page.startsWith('#users')) {
      const url = hash.split('/')
      const memberId = hash.split('/')[1]
      window.history.replaceState({ page: `userId=${memberId}`}, null, hash);
      layout() + memberProfile(url, memberId);
    }
  })

  window.addEventListener('hashchange', () => {
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
      const url = window.location.hash.split('/')
      const memberId = window.location.hash.split('/')[1]
      window.history.replaceState({ page: `userId=${memberId}`}, null, hash);
      layout() + memberProfile(url, memberId);
    }
  })
}

export default Router;
