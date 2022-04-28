const user_name = document.querySelector('#user_name');
const user_email = document.querySelector('#user_email');
const user_password = document.querySelector('#user_password');
const signupButton = document.querySelector('#signupButton');
const loadingSpinner = document.querySelector('.loading-spinner');

let handleNameValidationValue = false;
let handleEmailValidationValue = false;
let handlePasswordValidationValue = false;

const handleNameValidation = name => {
  const invalidCharacters = /[0-9!@#$%^&*()_\+=[\]{}|:;"<,>\?\/\\~`]/g;
  const validName = !invalidCharacters.test(name);

  if (name.length === 0 || !validName) {
    document.getElementById('name').classList.remove('animate-border-bottom');
    document.getElementById('name-wrapper').classList.add('form-error');
    handleNameValidationValue = false;
  } else if (name.length > 0 && validName) {
    if (document.getElementById('name-wrapper').classList.contains('form-error')) {
      document.getElementById('name-wrapper').classList.remove('form-error');
      document.getElementById('name').classList.add('animate-border-bottom');
    }
    handleNameValidationValue = true;
  }
};

const handleEmailValidation = email => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!emailRegex.test(email)) {
    document.getElementById('email').classList.remove('animate-border-bottom');
    document.getElementById('email-wrapper').classList.add('form-error');
    handleEmailValidationValue = false;
  } else if (emailRegex.test(email)) {
    if (document.getElementById('email-wrapper').classList.contains('form-error')) {
      document.getElementById('email-wrapper').classList.remove('form-error');
      document.getElementById('email').classList.add('animate-border-bottom');
    }
    handleEmailValidationValue = true;
  }
};

const handlePasswordValidation = password => {
  if (password.length < 8) {
    document.getElementById('password').classList.remove('animate-border-bottom');
    document.getElementById('password-wrapper').classList.add('form-error');
    handlePasswordValidationValue = false;
  } else if (password.length >= 8) {
    if (document.getElementById('password-wrapper').classList.contains('form-error')) {
      document.getElementById('password-wrapper').classList.remove('form-error');
      document.getElementById('password').classList.add('animate-border-bottom');
    }
    handlePasswordValidationValue = true;
  }
};

const handleSignupStepOne = async () => {
  const nameValue = user_name.value;
  const email = user_email.value;
  const password = user_password.value;

  handleNameValidation(nameValue);
  handleEmailValidation(email);
  handlePasswordValidation(password);

  if (handleNameValidationValue && handleEmailValidationValue && handlePasswordValidationValue) {
    loadingSpinner.style.display = 'inline-block';
    signupButton.innerHTML = '';
    signupButton.disabled = true;
    signupButton.style.cursor = 'not-allowed';

    document.querySelectorAll('form *').forEach(item => item.disabled = true);

    const userIPAddress = await getUserIPAddress();

    axios
      .post('/register/api/personal-info', {
        nameValue,
        email,
        password,
        userIPAddress,
      })
      .then(res => {
        Cookies.set('my_match_userId', res.data.userId, { sameSite: 'strict' });
        // Cookies.set('emailVerificationToken', res.data.emailVerificationToken, { sameSite: 'strict' });
        // if (res.status === 201) {
        //   window.location.pathname = '/verify-email';
        // } else if (res.status === 200) {
        //   window.location.pathname = '/signup/profile';
        // }
        window.location.pathname = '/signup/profile';
      })
      .catch(error => {
        console.error(error.response);
        if (error.response.status === 403) {
          /* Email address already exists */
          loadingSpinner.style.display = 'none';
          signupButton.innerHTML = 'Create Account';
          signupButton.disabled = false;
          signupButton.style.cursor = 'pointer';

          document.getElementById('email-exists-error').innerHTML = error.response.data.error;
          document.getElementById('email-exists-error').style.display = 'block';
        } else {
          /* Display generic error message */
          loadingSpinner.style.display = 'none';
          signupButton.innerHTML = 'Create Account';
          signupButton.disabled = false;
          signupButton.style.cursor = 'pointer';

          document.getElementById('email-exists-error').innerHTML =
            'We could not complete your request at this time.';
          document.getElementById('email-exists-error').style.display = 'block';
        }
      });
  }
};
