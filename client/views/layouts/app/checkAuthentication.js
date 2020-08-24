const checkAuthentication = async () => {
  try {
    const isAuthenticated = await axios.get("/api/authenticate", {
      headers: {
        Authorization: Cookies.get("token"),
      },
    });
    return isAuthenticated.status;
  } catch (err) {
    console.log("err:\n", err);
    return err.response;
  }
};

(async () => {
  const checkAuthenticationStatus = await checkAuthentication();
  console.log("checkAuthenticationStatus:\n", checkAuthenticationStatus);
  if (checkAuthenticationStatus === 201) {
    console.log(`Good to go`);
    return;
  } else {
    console.log(`Not allowed`);
    Cookies.remove("token");
    window.location.assign("/login");
  }
})();
