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
    axios.get('/api/profile-info').then(res => {
      const member = res.data.member
      const memberInfo = `
          <center>
          <h2 class="dashboard-text">Welcome, ${member.first_name}!</h2>

          <h4>Here is your basic info</h4>
          <div class="col-md-8 col-md-offset-4">
            <div class="col-md-6">
              <div class="thumbnail" style="border-radius: 12px">
                <p>Name: ${member.first_name} ${member.last_name}</p>
                <p>email: ${member.email}</p>
                <p>username: ${member.username}</p>
                <p>gender: ${member.gender}</p>
              </div>
            </div>
          </div>

          </center>
        `;
        const htmlOutput = profilePageLayout + memberInfo
        document.getElementById('my-app').innerHTML = htmlOutput
    })
  }
})