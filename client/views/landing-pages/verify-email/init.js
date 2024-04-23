window.onload = () => {
  Axios({
    method: 'get',
    apiUrl: '/api/register/check-email-verification', // server/routes/register/checkEmailVerification.js
  })
    .then(response => {
      const emailWasVerified = response?.emailWasVerified;
      if (emailWasVerified) window.location.pathname = response?.url;
    }).catch(() => {
      Cookies.remove('my_match_authToken');
      Cookies.remove('my_match_authUserId');
      window.location.pathname = '/signup';
    })
};
