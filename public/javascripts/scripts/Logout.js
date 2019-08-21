const logout = () => {
  Cookies.remove('token')
  Cookies.remove('name')
  Cookies.remove('id')
  window.location.pathname = '/login'
}