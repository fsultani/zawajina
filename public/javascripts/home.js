const beginLayout = `
  <div class="container">
    <div class="row">
      <div class="header clearfix">
        <nav style="padding-top: 10px">
          <ul class="nav nav-pills pull-left">
            <li role="presentation">
              <a href="/home"><h3>My App</h3></a>
            </li>
          </ul>
          <ul class="nav nav-pills pull-right">`

const loggedIn = `
<li role="presentation"><a onclick="logout()" style="cursor: pointer">Log Out</a></li>
<li role="presentation"><a href="/messages">Messages</a></li>
<li role="presentation"><a href="/profile">Profile</a></li>
`;

const notLoggedIn = `
<li role="presentation"><a href="/login">Login</a></li>
<li role="presentation"><a href="/register">Register</a></li>
`;

const endLayout = `</ul></nav></div></div></div></div>`;

function logout() {
  Cookies.remove('token')
  window.location.pathname = '/login'
}

window.addEventListener('load', () => {
  if (window.location.pathname === '/home' && Cookies.get('token')) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.status == 200) {
        const response = JSON.parse(this.responseText);

        const welcome = `
          <center>
            <h1>Welcome home!</h1>
            <h3>All members on this site</h3>
        `;

        let output = `<div class="col-md-8 col-md-offset-2">`;

        response.all.map((user) => {
          output += `
            <a href="/users/${user._id}/about" style="text-decoration: none">
              <div class="col-md-6">
                <div class="thumbnail" style="border-radius: 12px">
                  <h3 style="margin: 20px 0px">${user.first_name}</h3>
                </div>
              </div>
            </a>
          `;
        })

        output += `</div></center>`;
        const htmlOutput = beginLayout + loggedIn + endLayout + welcome + output;
        document.getElementById('my-app').innerHTML = htmlOutput;
      }
    }
    xhr.open('GET', '/all-members', true)
    xhr.setRequestHeader('user-cookie', Cookies.get('token'))
    xhr.send(null);
  } else if (window.location.pathname === '/home') {
    const welcome = `
      <center>
        <h1>Welcome!</h1>
        <h4>Please log in or create an account</h4>
      </center>
    `;

    const htmlOutput = beginLayout + notLoggedIn + endLayout + welcome;
    document.getElementById('my-app').innerHTML = htmlOutput;
    }
})