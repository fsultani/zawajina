const userPageLayout = `
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
          <li role="presentation"><a href="/users/member">Profile</a></li>
          </ul></nav></div></div></div></div>
          `;

window.addEventListener('load', () => {
  if (window.location.pathname.match(/^\/users\/*/)) {
  // if (window.location.pathname.includes('users')) {
    const userPath = window.location.pathname.split('/')[2]
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.status == 200) {
        const response = JSON.parse(this.responseText);
        console.log('response\n', response.member)
        const welcome = `
          <center>
            <h2 class="dashboard-text">${response.member.first_name}'s profile page</h2>

            <p>It's currently blank, but we plan on fixing that.</p>

            <p>In the meantime, you may contact ${response.member.first_name} using the button below.</p>

            <a href="/messages/{{member._id}}" class="btn btn-primary">Message</a>
          </center>
        `;
        const htmlOutput = userPageLayout + welcome
        document.getElementById('my-app').innerHTML = htmlOutput;
      }
    }
    xhr.open('GET', '/member/'+userPath, true)
    // xhr.setRequestHeader('user-cookie', Cookies.get('token'))
    xhr.send(null);
  }
})
