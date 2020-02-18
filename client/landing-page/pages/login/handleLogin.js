const handleLogin = event => {
  event.preventDefault();
  const email = document.login.elements.email.value;
  const password = document.login.elements.password.value;

  axios.post('/login', {
    email,
    password
  }).then(res => {
    Cookies.set('token', res.data.token)
    Cookies.set('userId', res.data.member._id)
    window.location.pathname = '/';
  })
}
