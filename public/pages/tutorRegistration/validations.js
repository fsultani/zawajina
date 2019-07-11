const signupFormElements = document.signupForm.elements;

const first_name = document.signupForm.first_name;
const last_name = document.signupForm.last_name;
const email = document.signupForm.email;
const password = document.signupForm.password;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handleFirstNameValidation = () => {
  console.log("handleFirstNameValidation")
  if (!first_name.checkValidity()) {
    document.signupForm.first_name.classList.add('form-error')

    signupFormElements.first_name.addEventListener("keyup", () => {
      if (first_name.checkValidity()) {
        document.signupForm.first_name.classList.remove('form-error')
        signupFormElements.first_name.removeEventListener("blur", () => {})
      } else {
        document.signupForm.first_name.classList.add('form-error')
      }
    })
  } else if (document.signupForm.last_name.classList.contains('form-error')) {
    document.signupForm.first_name.classList.remove('form-error')
  }
}

export const handleLastNameValidation = () => {
  if (!last_name.checkValidity()) {
    document.signupForm.last_name.classList.add('form-error')

    signupFormElements.last_name.addEventListener("keyup", () => {
      if (last_name.checkValidity()) {
        document.signupForm.last_name.classList.remove('form-error')
        signupFormElements.last_name.removeEventListener("blur", () => {})
      } else {
        document.signupForm.last_name.classList.add('form-error')
      }
    })
  } else if (document.signupForm.last_name.classList.contains('form-error')) {
    document.signupForm.last_name.classList.remove('form-error')
  }
}

export const handleEmailValidation = () => {
  if (!emailRegex.test(email.value)) {
    document.signupForm.email.classList.add('form-error')
  } else {
    document.signupForm.email.classList.remove('form-error')
  }

  signupFormElements.email.addEventListener("keyup", () => {
    if (!emailRegex.test(email.value)) {
      document.signupForm.email.classList.add('form-error')
      signupFormElements.last_name.removeEventListener("blur", () => {})
    } else {
      document.signupForm.email.classList.remove('form-error')
      signupFormElements.last_name.removeEventListener("blur", () => {})
    }
  })
}

export const handlePasswordValidation = () => {
  if (document.signupForm.password.value.length < 8) {
    document.signupForm.password.classList.add('form-error')
  } else {
    document.signupForm.password.classList.remove('form-error')
  }

  signupFormElements.password.addEventListener("keyup", () => {
    if (document.signupForm.password.value.length < 8) {
      document.signupForm.password.classList.add('form-error')
    } else {
      document.signupForm.password.classList.remove('form-error')
      signupFormElements.password.removeEventListener("blur", () => {})
    }
  })
}
