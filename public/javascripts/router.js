import { layout } from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import WelcomeHomePage from './views/home.js';
import loginPage from './views/login.js';

export default (() => {
  let { pathname, hash } = window.location;
  if (!hash || hash === '#home' || (pathname && hash)) {
    window.history.replaceState(null, null, '/');
    document.getElementById('app').innerHTML = layout + WelcomeHomePage();
  }

  window.addEventListener('popstate', (e) => {
    // console.log('e\n', e)
    console.log("popstate\n", window.location)
  })

  window.addEventListener('hashchange', () => {
    console.log("hashchange\n", window.location)
    switch (window.location.hash) {
      case '#home':
        window.history.replaceState(null, null, '/');
        document.getElementById('app').innerHTML = layout + WelcomeHomePage();
        break;
      case '#login':
        window.history.replaceState(null, null, '/login');
        document.getElementById('app').innerHTML = layout + loginPage;
        break;
      case '#register':
        window.history.replaceState(null, null, '/register');
        document.getElementById('app').innerHTML = layout + personalInfo;
        break;
      default:
        break;
    }
  })
})
