import layout from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import WelcomeHomePage from './views/home.js';
import loginPage from './views/login.js';

const Router = () => {
  console.log("window.location\n", window.location)
  console.log("Cookies.get('token')\n", Cookies.get('token'))
  let { pathname, hash } = window.location;
  if (!Cookies.get('token')) {
    window.history.pushState(null, null, '/login');
    document.getElementById('app').innerHTML = layout() + loginPage();
    const loginScript = document.createElement('script');
    loginScript.src = 'javascripts/scripts/login.js';
    document.head.appendChild(loginScript);
  } else {
    document.getElementById('app').innerHTML = layout() + WelcomeHomePage();
  }

  window.addEventListener('popstate', (e) => {
    console.log("popstate\n", window.location.pathname)
    switch (window.location.pathname) {
      case '/':
        document.getElementById('app').innerHTML = layout() + WelcomeHomePage();
        break;
      case '/login':
        document.getElementById('app').innerHTML = layout() + loginPage();
        break;
      case '/register':
        document.getElementById('app').innerHTML = layout() + personalInfo;
        break;
      case '/home':
        document.getElementById('app').innerHTML = layout() + WelcomeHomePage();
        break;
      default:
        break;
    }
  })

  window.addEventListener('hashchange', () => {
    console.log("hash\n", window.location.hash)
    switch (window.location.hash) {
      case '#home':
        window.history.replaceState(null, null, '/');
        document.getElementById('app').innerHTML = layout() + WelcomeHomePage();
        break;
      case '#login':
        window.history.replaceState(null, null, '/login');
        document.getElementById('app').innerHTML = layout() + loginPage();
        break;
      case '#register':
        window.history.replaceState(null, null, '/register');
        document.getElementById('app').innerHTML = layout() + personalInfo;
        break;
      default:
        break;
    }
  })
}

export default Router;