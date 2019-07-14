const signupFormElements = document.signupForm.elements;

const first_name = document.signupForm.first_name;
const last_name = document.signupForm.last_name;
const email = document.signupForm.email;
const password = document.signupForm.password;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let handleFirstNameValidationValue = false;
let handleLastNameValidationValue = false;
let handleEmailValidationValue = false;
let handlePasswordValidationValue = false;

const handleFirstNameValidation = () => {
  if (!first_name.checkValidity()) {
    document.signupForm.first_name.classList.add('form-error');

    signupFormElements.first_name.addEventListener("keyup", () => {
      if (first_name.checkValidity()) {
        document.signupForm.first_name.classList.remove('form-error');
        signupFormElements.first_name.removeEventListener("blur", () => {});
      } else {
        document.signupForm.first_name.classList.add('form-error');
      }
    })
  } else if (document.signupForm.last_name.classList.contains('form-error')) {
    document.signupForm.first_name.classList.remove('form-error');
  } else {
    handleFirstNameValidationValue = true;
  }
}

const handleLastNameValidation = () => {
  if (!last_name.checkValidity()) {
    document.signupForm.last_name.classList.add('form-error');

    signupFormElements.last_name.addEventListener("keyup", () => {
      if (last_name.checkValidity()) {
        document.signupForm.last_name.classList.remove('form-error');
        signupFormElements.last_name.removeEventListener("blur", () => {});
        handleLastNameValidationValue = true;
      } else {
        document.signupForm.last_name.classList.add('form-error');
      }
    })
  } else if (document.signupForm.last_name.classList.contains('form-error')) {
    document.signupForm.last_name.classList.remove('form-error');
  } else {
    handleLastNameValidationValue = true;
  }
}

const handleEmailValidation = () => {
  if (!emailRegex.test(email.value)) {
    document.signupForm.email.classList.add('form-error');
  } else {
    document.signupForm.email.classList.remove('form-error');
    handleEmailValidationValue = true;
  }

  signupFormElements.email.addEventListener("keyup", () => {
    if (!emailRegex.test(email.value)) {
      document.signupForm.email.classList.add('form-error');
      signupFormElements.last_name.removeEventListener("blur", () => {});
    } else {
      document.signupForm.email.classList.remove('form-error');
      signupFormElements.last_name.removeEventListener("blur", () => {});
      handleEmailValidationValue = true;
    }
  })
}

const handlePasswordValidation = () => {
  if (document.signupForm.password.value.length < 8) {
    document.signupForm.password.classList.add('form-error');
  } else {
    document.signupForm.password.classList.remove('form-error');
    handlePasswordValidationValue = true;
  }

  signupFormElements.password.addEventListener("keyup", () => {
    if (document.signupForm.password.value.length < 8) {
      document.signupForm.password.classList.add('form-error');
    } else {
      document.signupForm.password.classList.remove('form-error');
      signupFormElements.password.removeEventListener("blur", () => {});
      handlePasswordValidationValue = true;
    }
  })
}

const handleSignup = () => {
  handleFirstNameValidation();
  handleLastNameValidation();
  handleEmailValidation();
  handlePasswordValidation();

  const firstName = first_name.value;
  const lastName = last_name.value;
  const userEmail = email.value;
  const userPassword = password.value;

  if (
    handleFirstNameValidationValue && 
    handleLastNameValidationValue &&
    handleEmailValidationValue &&
    handlePasswordValidationValue
  ) {
    axios.post('/register/api/personal-info', {
      firstName,
      lastName,
      userEmail,
      userPassword
    }).then(res => {
      if (res.status === 200 && res.data.error) {
        document.getElementById('show-alert-danger').style.display = 'block';
      } else {
        Cookies.set('token', res.data.token);
        axios.defaults.headers.common['authorization'] = res.data.token
        // window.location.pathname = 'login'
      }
    }).catch(error => {
      error.response.data.error.map(err => {
        return err;
      })
    })
  }
}
