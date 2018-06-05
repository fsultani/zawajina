const authenticatedNavArea = count => {
  const navArea = `
    <div class="container">
      <div class="row">
        <div class="header clearfix">
          <nav style="padding-top: 10px">
            <ul class="nav nav-pills pull-left">
              <li role="presentation">
                <a href="/home">
                  <h3>My App<br>
                  <h5>(${Cookies.get('name')})</h5>
                  </h3>
                </a>
              </li>
            </ul>
            <ul class="nav nav-pills pull-right">
              <li role="presentation"><a onclick="logout()" style="cursor: pointer">Log Out</a></li>
              <li role="presentation"><a href="/messages">${count > 0 ? `Messages (${count})` : `Messages`}</a></li>
              <li role="presentation"><a href="/profile">Profile</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `
  return navArea
}

const notAuthenticated = `
<li role="presentation"><a href="/login">Login</a></li>
<li role="presentation"><a href="/register">Register</a></li>
`;
