const NavBar = async () => {
  const getUserId = async () => {
    try {
      const response = await axios.get(`/api/user-details`, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
      return response.data.userId;
    } catch (err) {
      return err.response;
    }
  };

  const userId = await getUserId();

  const content = `
    <div class="navbar--site-header">
      <div class="navbar--container">
        <div class="navbar--site-header-inner">
          <a class="home-link" href="/"><img src="/static/client/landing-page/images/home.svg" alt="Home"></a>
          <ul class="navbar--header-links margin-0">
            <li>
              <a href="/user/${userId}">Profile</a>
            </li>
            <li>
              <a href="/search">Search</a>
            </li>
            <li>
              <a id="logout" style="cursor: pointer">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;
  document.querySelector("#nav").innerHTML = content;

  document.querySelector("#logout").onclick = () => {
    Cookies.remove("token");
    window.location.pathname = "/login";
  };
};

export default NavBar;
