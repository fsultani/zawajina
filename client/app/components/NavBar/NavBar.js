const NavBar = () => {
  const googleapis = document.createElement('link');
  googleapis.rel = "stylesheet";
  googleapis.href = "https://fonts.googleapis.com/css?family=Lato:400,400i|PT+Serif:700";

  const navBarCss = document.createElement('link');
  navBarCss.rel = "stylesheet"
  navBarCss.href = '/static/client/app/components/NavBar/navBarStyles.css';

  document.head.appendChild(googleapis);
  document.head.appendChild(navBarCss);

  const navBar = `
    <header class="navbar--site-header">
      <div class="navbar--container">
        <div class="navbar--site-header-inner">
          <div>
            <a href="/"><img src="/static/client/landing-page/images/home.svg" alt="Home"></a>
          </div>
          <ul class="navbar--header-links margin-0">
            <li>
              <a href="/search">Search</a>
            </li>
            <li>
              <a id="logout" style="cursor: pointer">Logout</a></li>
            </li>
          </ul>
        </div>
      </div>
    </header>

  `;
  document.getElementById('navbar').innerHTML = navBar;

  document.getElementById('logout').onclick = () => {
    Cookies.remove('token');
    window.location.pathname = '/login';
  }
}

export default NavBar;
