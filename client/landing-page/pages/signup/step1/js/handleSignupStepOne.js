const signupFormElements = document.signupForm.elements;

const user_name = document.signupForm.user_name;
const user_email = document.signupForm.user_email;
const user_password = document.signupForm.user_password;
const submitButton = document.signupForm.signupButton;
const loadingSpinner = document.querySelector('.loading-spinner');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let handleNameValidationValue = false;
let handleEmailValidationValue = false;
let handlePasswordValidationValue = false;

const disableSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.style.opacity = 0.5;
  submitButton.style.cursor = 'not-allowed';
}

const enableSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.style.opacity = 1;
  submitButton.style.cursor = 'pointer';
}

const handleNameValidation = () => {
  if (!user_name.checkValidity()) {
    user_name.classList.add('form-error');
    disableSubmitButton();

    signupFormElements.user_name.addEventListener("keyup", () => {
      if (user_name.checkValidity()) {
        document.signupForm.user_name.classList.remove('form-error');
        signupFormElements.user_name.removeEventListener("keyup", () => {});
        enableSubmitButton();
      } else {
        document.signupForm.user_name.classList.add('form-error');
        disableSubmitButton();
      }
    })
  } else {
    handleNameValidationValue = true;
  }
}

const handleEmailValidation = () => {
  if (!emailRegex.test(user_email.value)) {
    document.signupForm.user_email.classList.add('form-error');
    disableSubmitButton();
  } else {
    document.signupForm.user_email.classList.remove('form-error');
    enableSubmitButton();
    handleEmailValidationValue = true;
  }

  signupFormElements.user_email.addEventListener("keyup", () => {
    if (!emailRegex.test(user_email.value)) {
      document.signupForm.user_email.classList.add('form-error');
      signupFormElements.user_name.removeEventListener("keyup", () => {});
      disableSubmitButton();
    } else {
      document.signupForm.user_email.classList.remove('form-error');
      signupFormElements.user_name.removeEventListener("keyup", () => {});
      enableSubmitButton();
      handleEmailValidationValue = true;
    }
  })
}

const handlePasswordValidation = () => {
  if (document.signupForm.user_password.value.length < 8) {
    document.signupForm.user_password.classList.add('form-error');
    disableSubmitButton();
  } else {
    document.signupForm.user_password.classList.remove('form-error');
    enableSubmitButton();
    handlePasswordValidationValue = true;
  }

  signupFormElements.user_password.addEventListener("keyup", () => {
    if (document.signupForm.user_password.value.length < 8) {
      document.signupForm.user_password.classList.add('form-error');
      disableSubmitButton();
    } else {
      document.signupForm.user_password.classList.remove('form-error');
      signupFormElements.user_password.removeEventListener("keyup", () => {});
      enableSubmitButton();
      handlePasswordValidationValue = true;
    }
  })
}

const handleSignupStepOne = () => {
  handleNameValidation();
  handleEmailValidation();
  handlePasswordValidation();

  const name = user_name.value;
  const email = user_email.value;
  const password = user_password.value;

  if (
    handleNameValidationValue &&
    handleEmailValidationValue &&
    handlePasswordValidationValue
  ) {
    loadingSpinner.style.display = 'inline-block';
    submitButton.innerHTML = "";
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';

    axios.post('/register/api/personal-info', {
      name,
      email,
      password
    }).then(res => {
      if (res.status === 201) {
        Cookies.set('userId', res.data.userId);
        window.location.pathname = '/signup/profile';
      }
    }).catch(error => {
      console.log("error.response\n", error.response);
      if (error.response.status === 403) {
        loadingSpinner.style.display = 'none';
        submitButton.innerHTML = "Create Account";
        submitButton.disabled = false;
        submitButton.style.cursor = 'pointer';

        document.getElementById('email-exists-error').innerHTML = error.response.data.error;
        document.getElementById('email-exists-error').style.display = 'block';
      }
    })
  }
}
