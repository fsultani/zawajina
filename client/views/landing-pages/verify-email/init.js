(() => {
  axios.get('/register/api/send-verification-email').then(res => {
    if (res.data.message === 'Email verified') {
      window.location.pathname = '/signup/profile';
    }
  }).catch(error => {
    Cookies.remove('my_match_authToken');
    Cookies.remove('my_match_userId');
    window.location.pathname = '/signup';
  })
})();
