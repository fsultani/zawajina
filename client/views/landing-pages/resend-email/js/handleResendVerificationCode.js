const user_email = document.querySelector('#user_email');
const signupButton = document.querySelector('#signupButton');
const loadingSpinner = document.querySelector('.loading-spinner');

let handleEmailValidationValue = false;

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

const handleResendVerificationCode = () => {
  const email = user_email.value;
  handleEmailValidation(email);

  if (handleEmailValidationValue) {
    loadingSpinner.style.display = 'inline-block';
    signupButton.innerHTML = '';
    signupButton.disabled = true;
    signupButton.style.cursor = 'not-allowed';

    document.querySelectorAll('form *').forEach(item => item.disabled = true);

    axios
      .post('/register/api/resend-email', {
        email,
      })
      .then(res => {
        if (res.status === 201) {
          window.location.pathname = '/verify-email';
        } else {
          window.location.pathname = '/signup';
        }
      })
      .catch(error => {
        console.error(error.response);
        if (error.response.status === 403) {
          // Email address already exists
          loadingSpinner.style.display = 'none';
          signupButton.innerHTML = 'Create Account';
          signupButton.disabled = false;
          signupButton.style.cursor = 'pointer';

          document.getElementById('email-exists-error').innerHTML = error.response.data.error;
          document.getElementById('email-exists-error').style.display = 'block';
        } else {
          // Display generic error message
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
