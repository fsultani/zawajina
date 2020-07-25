const handleEmailValidation = () => {
  const email = document.login.elements.email.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const handlePasswordValidation = () => {
  const password = document.login.elements.password.value;
  return password.length > 0;
}

const handleLogin = event => {
  event.preventDefault();
  const email = document.login.elements.email.value;
  const password = document.login.elements.password.value;
  const loginButton = document.login.elements.loginButton;
  const loadingSpinner = document.querySelector('.lds-ring')

  const emailIsValid = handleEmailValidation();
  const passwordIsValid = handlePasswordValidation();

  if (emailIsValid && passwordIsValid) {
    loginButton.innerHTML = ""
    loadingSpinner.style.display = 'inline-block'
    loginButton.disabled = true;
    loginButton.style.opacity = 0.5;
    loginButton.style.cursor = 'not-allowed';

    axios.post('/login', {
      email,
      password
    }).then(res => {
      const { token } = res.data;
      Cookies.set('token', token);
      window.location.pathname = '/';
    }).catch(error => {
      loginButton.innerHTML = "Login"
      loadingSpinner.style.display = 'none';
      loginButton.disabled = false;
      loginButton.style.opacity = 1;
      loginButton.style.cursor = 'pointer';
      // For any login errors, only display 'Invalid password' for security purposes
      document.getElementById('invalid-password').style.display = 'block';
    })
  } else {
    if (!emailIsValid) {
      document.login.email.blur()
      document.getElementById('email').classList.add('email-error')
      document.getElementById('email-wrapper').classList.add('form-error')
    };

    const emailHasError = document.getElementById('email').classList.contains('email-error')
    if (emailIsValid && emailHasError) {
      document.getElementById('email').classList.remove('email-error')
      document.getElementById('email-wrapper').classList.remove('form-error')
    }

    if (!passwordIsValid) {
      document.login.password.blur()
      document.getElementById('password').classList.add('form-error')
    };
  }
}
