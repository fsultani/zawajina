import { layout } from './views/layout.js';
import {
  handleNameError,
  handleEmailError,
  handlePasswordErrorOnBlur,
  handlePasswordErrorOnKeyUp,
  isPasswordValid,
  personalInfo
} from '/javascripts/views/register/personalInfo.js';
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
    const registrationFormElement = document.forms.registration.elements
    registrationFormElement.signUpButton.disabled = true
    registrationFormElement.name.addEventListener("blur", handleNameError)
    registrationFormElement.email.addEventListener("blur", handleEmailError)
    registrationFormElement.password.addEventListener("blur", handlePasswordErrorOnBlur)
    registrationFormElement.password.addEventListener("keyup", handlePasswordErrorOnKeyUp)
    registrationFormElement.password.addEventListener("keyup", isPasswordValid)
  } else if (window.location.pathname === '/register/about') {
    document.getElementById('app').innerHTML = layout + profileAbout;
  }
})