(() => {
  const existingCookies = Object.keys(Cookies.get());
  if (existingCookies.length > 0) {
    existingCookies
      .filter(cookie => cookie.split('_')[0] === 'my' && cookie.split('_')[1] === 'match')
      .map(cookie => {
        Cookies.remove(cookie);
        if (window.location.pathname !== '/login') {
          window.location.pathname = '/login';
        }
      })
  }
})();
