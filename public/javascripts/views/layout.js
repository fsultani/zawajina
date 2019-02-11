const layout = () => `
  <div class="container">
    <div class="row">
      <div class="header clearfix">
        <nav style="padding-top: 10px">
          <ul class="nav nav-pills pull-left">
            <li role="presentation">
              <a href="#home"><h3>My App</h3></a>
            </li>
          </ul>
          <ul class="nav nav-pills pull-right">
            <li role="presentation">${Cookies.get('token') ? `<a href="#logout">Logout</a>` : `<a href="#login">Login</a>`}</li>
            <li role="presentation"><a href="#register">Register</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
`;

export default layout;
