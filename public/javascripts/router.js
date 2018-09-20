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
    window.location.hash = '#home'
  }

  // window.onpopstate = () => {
  //   console.log("onpopstate")
  // }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#home') {
      document.getElementById('app').innerHTML = layout + WelcomeHomePage();
      window.history.pushState('', '', 'home');
      console.log("window.location\n", window.location)
    } else if (window.location.hash === '#login') {
      document.getElementById('app').innerHTML = layout + loginPage;
      window.history.pushState('', '', 'login');
      console.log("window.location\n", window.location)
    }
  })
  // if (!window.location.hash) {
  //   console.log("empty hash")
  //   window.location.hash = '#home'
  //   console.log("Not empty anymore!")
  //   document.getElementById('app').innerHTML = layout + WelcomeHomePage();

  // } else if (window.location.hash === '#home') {
  //   console.log("home page")
  //   document.getElementById('app').innerHTML = layout + WelcomeHomePage();
  // }
  // else if (window.location.pathname === '/login') {
  //   document.getElementById('app').innerHTML = layout + loginPage;
  // } else if (window.location.pathname === '/register') {
  //   document.getElementById('app').innerHTML = layout + personalInfo;
  //   // PersonalInfoValidation()
  //   HandleSignUp()
  // } else if (window.location.hash === '#about') {
  //   document.getElementById('app').innerHTML = layout + profileAbout;
  // }
})

// const navigate = () => {
//   console.log("window.location.hash.substr(1)\n", window.location.hash.substr(1))
//   console.log("navigate")
//   window.location.pathname = '/'
// }