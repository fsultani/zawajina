const checkAuthentication = async () => {
  try {
    const isAuthenticated = await axios.get("/api/authenticate", {
      headers: {
        Authorization: Cookies.get('token')
      }
    })
    return isAuthenticated.status;
  } catch (err) {
    return err.response;
  }
};

(async () => {
  const checkAuthenticationStatus = await checkAuthentication();
  if (checkAuthenticationStatus === 200 || checkAuthenticationStatus === 201) {
    return;
  } else {
    Cookies.remove('token');
    window.location.assign('/login');
  }
})()
