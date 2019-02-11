const handleLogin = () => {
  const email = document.loginForm.email.value
  const password = document.loginForm.password.value

  axios.post('/login', {
    email,
    password
  }).then(res => {
    Cookies.set('token', res.data.token)
    Cookies.set('name', res.data.member.name)
    Cookies.set('id', res.data.member._id)
    axios.defaults.headers.common['authorization'] = res.data.token
    window.location.hash = 'home'
  })
}
