const profilePageLayout = `
  <div class="container">
    <div class="row">
      <div class="header clearfix">
        <nav style="padding-top: 10px">
          <ul class="nav nav-pills pull-left">
            <li role="presentation">
              <a href="/home"><h3>My App</h3></a>
            </li>
          </ul>
          <ul class="nav nav-pills pull-right">
          <li role="presentation"><a onclick="logout()" style="cursor: pointer">Log Out</a></li>
          <li role="presentation"><a href="/messages">Messages</a></li>
          <li role="presentation"><a href="/profile">Profile</a></li>
          </ul></nav></div></div></div></div>
          `;

window.addEventListener('load', () => {
  if (window.location.pathname === '/profile' && Cookies.get('token')) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.status == 200) {
        const response = JSON.parse(this.responseText);
        const memberInfo = `
          <center>
          <h2 class="dashboard-text">Welcome, ${response.member.first_name}!</h2>

          <h4>Here is your basic info:</h4>
          <div style="margin: 0 auto; width: 20%">
          <div style="margin: 0 auto; text-align: left">
          <p>Name: ${response.member.first_name} ${response.member.last_name}</p>
          <p>email: ${response.member.email}</p>
          <p>username: ${response.member.username}</p>
          <p>gender: ${response.member.gender}</p>
          </div>
          </div>

          </center>
        `;
        const htmlOutput = profilePageLayout + memberInfo
        document.getElementById('my-app').innerHTML = htmlOutput
      }
    }
    xhr.open('GET', '/profile-info', true)
    xhr.setRequestHeader('user-cookie', Cookies.get('token'))
    xhr.send(null);
  }
})