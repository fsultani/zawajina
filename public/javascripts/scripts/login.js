function login() {
  const username = document.loginForm.username.value
  const password = document.loginForm.password.value

  axios.post('/login', {
    username: username,
    password: password
  }).then(res => {
    Cookies.set('token', res.data.token)
    Cookies.set('first_name', res.data.member.first_name)
    Cookies.set('id', res.data.member._id)
    window.location.pathname = '/home'
  })
}
