import layout from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import welcome from './views/welcome.js';
import login from './views/login.js';
import memberProfile from './views/memberProfile.js';

let currentPath = null;

const Router = () => {
  axios.defaults.headers.common['authorization'] = Cookies.get('token')
  let { pathname, hash } = window.location;

  const loginScript = document.createElement('script');
  loginScript.src = 'javascripts/scripts/Login.js';
  document.head.appendChild(loginScript);

  const logoutScript = document.createElement('script');
  logoutScript.src = 'javascripts/scripts/Logout.js';
  document.head.appendChild(logoutScript);

  if (Cookies.get('token')) {
    window.location.hash = '#home';
  } else {
    document.getElementById('app').innerHTML = layout() + login();
  }

  window.addEventListener('popstate', (e) => {
    if (!e.state) {
      e.preventDefault()
      return false;
    }
    switch (window.location.pathname) {
      case '/':
        layout() + welcome();
        break;
      case '/login':
        // layout() + welcome();
        break;
      case '/register':
        // document.getElementById('app').innerHTML = layout() + personalInfo;
        break;
      case '/home':
        // document.getElementById('app').innerHTML = layout() + welcome();
        break;
      default:
        break;
    }
  })

  window.addEventListener('hashchange', () => {
    const { hash } = window.location;
    if (hash === '#home') {
      window.history.pushState(null, null, '/');
      layout() + welcome();
    } else if (hash === '#login') {
      window.history.pushState(null, null, '/login');
      document.getElementById('app').innerHTML = layout() + login();
    } else if (hash === '#register') {
      window.history.pushState(null, null, '/register');
      document.getElementById('app').innerHTML = layout() + personalInfo;
    } else if (hash.startsWith('#users')) {
      window.history.pushState(null, null, hash);
      layout() + memberProfile();
    }
  })
}

export default Router;
