const disableForm = (disabled) => document.querySelectorAll('form *').forEach(item => item.disabled = disabled);

const handleEmailValidation = () => {
  const email = document.login.elements.email.value;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};

const handlePasswordValidation = () => {
  const password = document.login.elements.password.value;
  return password.length > 0;
};

const handleLogin = async event => {
  event.preventDefault();
  const email = document.login.elements.email.value.toLowerCase();
  const password = document.login.elements.password.value;
  const loginButton = document.login.elements.loginButton;
  const loadingSpinner = document.querySelector('.loading-spinner');

  const emailIsValid = handleEmailValidation();
  const passwordIsValid = handlePasswordValidation();

  if (emailIsValid && passwordIsValid) {
    loadingSpinner.style.cssText = `display: inline-block`;
    loginButton.innerHTML = '';
    loginButton.style.cssText = `
      disabled: true;
      opacity: 0.5;
      cursor: not-allowed;
    `;

    disableForm(true);

    const userIPAddress = await getUserIPAddress();
    axios
      .post('/login', {
        email,
        password,
        userIPAddress,
      })
      .then(res => {
        const { token } = res.data;
        Cookies.set('my_match_authToken', token, { sameSite: 'strict' });
        window.location.pathname = '/users';
      })
      .catch(() => {
        disableForm(false);
        loadingSpinner.style.display = 'none';
        loginButton.innerHTML = 'Login';
          loginButton.style.cssText = `
          disabled: false;
          opacity: 1;
          cursor: pointer;
        `;

        // For any login errors, only display 'Invalid password' for security purposes
        document.getElementById('invalid-password').style.display = 'block';
      });
  } else {
    if (!emailIsValid) {
      document.login.email.blur();
      document.getElementById('email').classList.add('email-error');
      document.getElementById('email-wrapper').classList.add('form-error');
      disableForm(false);
    }

    const emailHasError = document.getElementById('email').classList.contains('email-error');
    if (emailIsValid && emailHasError) {
      document.getElementById('email').classList.remove('email-error');
      document.getElementById('email-wrapper').classList.remove('form-error');
      disableForm(false);
    }

    if (!passwordIsValid) {
      document.login.password.blur();
      document.getElementById('password').classList.add('form-error');
      disableForm(false);
    }
  }
};
