const NavBar = () => (`
  <div class="navbar--site-header">
    <div class="navbar--container">
      <div class="navbar--site-header-inner">
        <div>
          <a href="/"><img src="/static/client/landing-page/images/home.svg" alt="Home"></a>
        </div>
        <ul class="navbar--header-links margin-0">
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
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
`);

export default NavBar;
