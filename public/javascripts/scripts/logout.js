const handleLogout = () => {
  Cookies.remove('token')
  Cookies.remove('name')
  Cookies.remove('id')
  window.location.hash = 'login'
}