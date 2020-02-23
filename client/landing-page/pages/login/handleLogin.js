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

  const emailIsValid = handleEmailValidation();
  const passwordIsValid = handlePasswordValidation();

  if (emailIsValid && passwordIsValid) {
    axios.post('/login', {
      email,
      password
    }).then(res => {
      Cookies.set('token', res.data.token)
      Cookies.set('userId', res.data.member._id)
      window.location.pathname = '/';
    })
  } else {
    if (!emailIsValid) {
      document.login.email.blur()
      document.getElementById('email').classList.add('email-error')
    };

    if (!passwordIsValid) {
      document.login.password.blur()
      document.getElementById('password').classList.add('password-error')
    };
  }
}
