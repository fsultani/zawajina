const handleSignup = () => {
  const first_name = document.signupForm.first_name.value
  const last_name = document.signupForm.last_name.value
  const email = document.signupForm.email.value
  const password = document.signupForm.password.value
  console.log("first_name\n", first_name)
  console.log("last_name\n", last_name)
  console.log("email\n", email)
  console.log("password\n", password)

  axios.post('/register/api/personal-info', {
    first_name,
    last_name,
    email,
    password
  }).then(res => {
    console.log("res.data\n", res.data)
    Cookies.set('token', res.data.token)
    axios.defaults.headers.common['authorization'] = res.data.token
    // window.location.hash = 'home'
  }).catch(err => {
    console.log("err\n", err)
  })
}
