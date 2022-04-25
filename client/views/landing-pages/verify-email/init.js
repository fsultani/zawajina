(() => {
  const emailVerificationToken = Cookies.get('emailVerificationToken')
  console.log(`emailVerificationToken\n`, emailVerificationToken);

  const inputElement = document.querySelector('.verification-token');
  inputElement.value = emailVerificationToken;
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
