const signupFormElements = document.signupForm.elements
const first_name = document.signupForm.first_name
const last_name = document.signupForm.last_name
const email = document.signupForm.email
const password = document.signupForm.password
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleFirstNameValidation = () => {
  if (!first_name.checkValidity()) {
    document.signupForm.first_name.classList.add('form-error')

    signupFormElements.first_name.addEventListener("blur", () => {
      if (first_name.checkValidity()) {
        document.signupForm.first_name.classList.remove('form-error')
        signupFormElements.first_name.removeEventListener("blur", () => {})
      } else {
        document.signupForm.first_name.classList.add('form-error')
      }
    })
  }
}

const handleLastNameValidation = () => {
  if (!last_name.checkValidity()) {
    document.signupForm.last_name.classList.add('form-error')

    signupFormElements.last_name.addEventListener("blur", () => {
      if (last_name.checkValidity()) {
        document.signupForm.last_name.classList.remove('form-error')
        signupFormElements.last_name.removeEventListener("blur", () => {})
      } else {
        document.signupForm.last_name.classList.add('form-error')
      }
    })
  }
}

const handleEmailValidation = () => {
  if (!emailRegex.test(email.value)) {
    console.log("form-error")
    document.signupForm.email.classList.add('form-error')

    // signupFormElements.email.addEventListener("blur", () => {
    //   if (emailRegex.test(email.value)) {
    //     document.signupForm.email.classList.remove('form-error')
    //     signupFormElements.email.removeEventListener("blur", () => {})
    //   } else {
    //     document.signupForm.email.classList.add('form-error')
    //   }
    // })
  }
}

const handlePasswordValidation = () => {
  if (!password.checkValidity()) {
    document.signupForm.password.classList.add('form-error')

    signupFormElements.password.addEventListener("blur", () => {
      if (password.checkValidity()) {
        document.signupForm.password.classList.remove('form-error')
        signupFormElements.password.removeEventListener("blur", () => {})
      } else {
        document.signupForm.password.classList.add('form-error')
      }
    })
  }
}

const handleSignup = () => {
  handleFirstNameValidation()
  handleLastNameValidation()
  handleEmailValidation()
  handlePasswordValidation()

  // axios.post('/register/api/personal-info', {
  //   first_name,
  //   last_name,
  //   email,
  //   password
  // }).then(res => {
  //   console.log("res.data\n", res.data)
  //   Cookies.set('token', res.data.token)
  //   axios.defaults.headers.common['authorization'] = res.data.token
  //   window.location.pathname = 'login'
  // }).catch(err => {
  //   console.log("err\n", err)
  // })
}
