const handleLogout = () => {
  Cookies.remove('token')
  Cookies.remove('name')
  Cookies.remove('id')
  Cookies.remove('conversationCount')
  window.location.hash = 'login'
}