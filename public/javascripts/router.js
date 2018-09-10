import { layout } from './views/layout.js';
import { personalInfo } from './views/register/personalInfo/index.js';
import PersonalInfoValidation from './views/register/personalInfo/validations.js';
import HandleSignUp from './views/register/personalInfo/handleSignUp.js';
import profileAbout from './views/register/about/index.js';
import WelcomeHomePage from './views/home.js';
import loginPage from './views/login.js';

export default (() => {
  if (window.location.pathname === '/') {
    window.location.pathname = '/home'
  } else if (window.location.pathname === '/home') {
    document.getElementById('app').innerHTML = layout + WelcomeHomePage();
  } else if (window.location.pathname === '/login') {
    document.getElementById('app').innerHTML = layout + loginPage;
  } else if (window.location.pathname === '/register') {
    document.getElementById('app').innerHTML = layout + personalInfo;
    PersonalInfoValidation()
    HandleSignUp()
  } else if (window.location.pathname === '/about') {
    document.getElementById('app').innerHTML = layout + profileAbout;
  }
})