import NavBar from "./components/NavBar/NavBar.js";
import Body from "./Body.js";
import Profile from "./Profile.js";
import Search from "./Search.js";

const checkAuthentication = async () => {
  try {
    const isAuthenticated = await axios.get("/api/authenticate", {
      headers: {
        Authorization: Cookies.get("token"),
      },
    });
    return isAuthenticated.status;
  } catch (err) {
    return err.response;
  }
};

const Router = async path => {
  const checkAuthenticationStatus = await checkAuthentication();
  if (checkAuthenticationStatus === 201) {
    NavBar();
    if (path === "home" || path === "/") {
      Body();
    } else if (path.startsWith("user/")) {
      const userId = path.split("/")[1];
      Profile(userId);
    } else if (path === "search") {
      Search();
    } else {
      Body();
    }
  } else {
    Cookies.remove("token");
    window.location.assign("/login");
  }
};

(() => {
  const { pathname } = window.location;
  const path = pathname.length > 1 ? pathname.slice(1, pathname.length) : pathname;
  Router(path);
})();
