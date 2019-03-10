import {
  handleNameError,
  handleEmailError,
  handlePasswordErrorOnBlur,
  handlePasswordErrorOnKeyUp,
  isPasswordValid,
  personalInfo
} from './index.js';

export default (() => {
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
})
