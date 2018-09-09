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

    let nameEmailPassword = document.querySelectorAll("[name='name'], [name='email'], [name='password']")
    let genderButtons = document.querySelectorAll("input[type='radio']")
    let DOB = document.querySelectorAll("[name='birthMonth'], [name='birthDate'], [name='birthYear']")

    for (let i = 0; i < nameEmailPassword.length; i++) {
      nameEmailPassword[i].onkeyup = () => {
        if (
          registrationFormElement.name.checkValidity() &&
          registrationFormElement.email.checkValidity() &&
          isPasswordValid()
        ) {
          if (
            registrationFormElement.male.checked ||
            registrationFormElement.female.checked
          ) {
            registrationFormElement.signUpButton.disabled = false
          } else {
            for (let i = 0; i < genderButtons.length; i++) {
              genderButtons[i].onchange = () => {
                if (
                  registrationFormElement.male.checked ||
                  registrationFormElement.female.checked
                ) {
                  for (let i = 0; i < DOB.length; i++) {
                    DOB[i].onchange = () => {
                      if (
                        registrationFormElement.birthMonth.value !== 'Month' &&
                        registrationFormElement.birthDate.value !== 'Day' &&
                        registrationFormElement.birthYear.value !== 'Year'
                      ) {
                        registrationFormElement.signUpButton.disabled = false
                      } else {
                        registrationFormElement.signUpButton.disabled = true
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          registrationFormElement.signUpButton.disabled = true
        }
      }
    }
  } else if (window.location.pathname === '/register/about') {
    document.getElementById('app').innerHTML = layout + profileAbout;
  }
})