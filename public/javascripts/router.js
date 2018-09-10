import { layout } from './views/layout.js';
import { personalInfo } from '/javascripts/views/register/personalInfo/index.js';
import PersonalInfoValidation from '/javascripts/views/register/personalInfo/validations.js';
import profileAbout from '/javascripts/views/register/profileAbout.js';
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
  } else if (window.location.pathname === '/register/about') {
    document.getElementById('app').innerHTML = layout + profileAbout;
  }
})