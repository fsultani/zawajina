const logout = () => {
  Cookies.remove('token')
  Cookies.remove('first_name')
  Cookies.remove('id')
  window.location.pathname = '/login'
}