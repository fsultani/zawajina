const signupFormElements = document.signupForm.elements;

const name = document.signupForm.name;
const email = document.signupForm.email;
const password = document.signupForm.password;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let handleNameValidationValue = false;
let handleEmailValidationValue = false;
let handlePasswordValidationValue = false;

const disableSubmitButton = () => {
  document.signupForm.signupButton.disabled = true;
  document.signupForm.signupButton.style.opacity = 0.5;
  document.signupForm.signupButton.style.cursor = 'not-allowed';
}

const enableSubmitButton = () => {
  document.signupForm.signupButton.disabled = false;
  document.signupForm.signupButton.style.opacity = 1;
  document.signupForm.signupButton.style.cursor = 'pointer';
}

const handleNameValidation = () => {
  if (!name.checkValidity()) {
    document.signupForm.name.classList.add('form-error');
    disableSubmitButton();

    signupFormElements.name.addEventListener("keyup", () => {
      if (name.checkValidity()) {
        document.signupForm.name.classList.remove('form-error');
        signupFormElements.name.removeEventListener("keyup", () => {});
        enableSubmitButton();
      } else {
        document.signupForm.name.classList.add('form-error');
        disableSubmitButton();
      }
    })
  } else {
    handleNameValidationValue = true;
  }
}

const handleEmailValidation = () => {
  if (!emailRegex.test(email.value)) {
    document.signupForm.email.classList.add('form-error');
    disableSubmitButton();
  } else {
    document.signupForm.email.classList.remove('form-error');
    enableSubmitButton();
    handleEmailValidationValue = true;
  }

  signupFormElements.email.addEventListener("keyup", () => {
    if (!emailRegex.test(email.value)) {
      document.signupForm.email.classList.add('form-error');
      signupFormElements.name.removeEventListener("keyup", () => {});
      disableSubmitButton();
    } else {
      document.signupForm.email.classList.remove('form-error');
      signupFormElements.name.removeEventListener("keyup", () => {});
      enableSubmitButton();
      handleEmailValidationValue = true;
    }
  })
}

const handlePasswordValidation = () => {
  if (document.signupForm.password.value.length < 8) {
    document.signupForm.password.classList.add('form-error');
    disableSubmitButton();
  } else {
    document.signupForm.password.classList.remove('form-error');
    enableSubmitButton();
    handlePasswordValidationValue = true;
  }

  signupFormElements.password.addEventListener("keyup", () => {
    if (document.signupForm.password.value.length < 8) {
      document.signupForm.password.classList.add('form-error');
      disableSubmitButton();
    } else {
      document.signupForm.password.classList.remove('form-error');
      signupFormElements.password.removeEventListener("keyup", () => {});
      enableSubmitButton();
      handlePasswordValidationValue = true;
    }
  })
}

const handleCreateAccount = () => {
  handleNameValidation();
  handleEmailValidation();
  handlePasswordValidation();

  const userName = name.value;
  const userEmail = email.value;
  const userPassword = password.value;

  if (
    handleNameValidationValue && 
    handleEmailValidationValue &&
    handlePasswordValidationValue
  ) {
    axios.post('/register/api/personal-info', {
      userName,
      userEmail,
      userPassword
    }).then(res => {
      if (res.status === 200 && res.data.error) {
        document.getElementById('show-alert-danger').style.display = 'block';
      } else {
        Cookies.set('token', res.data.token);
        Cookies.set('userId', res.data.userId);
        axios.defaults.headers.common['authorization'] = res.data.token
        window.location.pathname = '/signup/profile'
      }
    }).catch(error => {
      error.response && error.response.data.error.map(err => {
        return err;
      })
    })
  }
}
