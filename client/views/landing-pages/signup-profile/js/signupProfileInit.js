axios.get('/register/api/signup-user-first-name').then(res => {
  // if (res.data.message === 'Token Sent') {
  //   window.location.pathname = '/verify-email';
  // }
  document.querySelector('.form-title').innerHTML = `Welcome, ${res.data.name}`;
}).catch(err => {
  if (err instanceof TypeError) {
    console.error(err);
  } else {
    Cookies.remove('my_match_authToken');
    Cookies.remove('my_match_userId');
    window.location.pathname = '/signup';
  }
});
