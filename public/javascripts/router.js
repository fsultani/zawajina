import { layout } from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import WelcomeHomePage from './views/home.js';
import loginPage from './views/login.js';

export default (() => {
  if (!window.location.hash) {
    console.log("Empty hash")
    window.location.hash = 'home'
  }

  window.addEventListener('popstate', (e) => {
    // console.log('e\n', e)
  })

  window.addEventListener('hashchange', () => {
    console.log('hash\n', window.location.hash)
    switch (window.location.hash) {
      case '#home':
        // window.location.hash = ''
        document.getElementById('app').innerHTML = layout + WelcomeHomePage();
        // window.history.pushState({page: 'homePage'}, '', 'home');
        break;
      case '#login':
        // window.location.hash = ''
        document.getElementById('app').innerHTML = layout + loginPage;
        // window.history.pushState({page: 'loginPage'}, '', 'login');
        break;
      default:
        break;
    }
  })
})
