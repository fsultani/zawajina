const messagesLayout = `
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
  if (window.location.pathname === '/messages' && Cookies.get('token')) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.status == 200) {
        const response = JSON.parse(this.responseText);

        let memberInfo = `
          <center>
            <h2 class="dashboard-text">Your messages</h2>
        `;
        response.conversations.map((c) => {
          memberInfo += `<p>${c.sent_to_user_name}</p>`
        })
        memberInfo += `</center>`

        const htmlOutput = profilePageLayout + memberInfo
        document.getElementById('my-app').innerHTML = htmlOutput
      }
    }
    xhr.open('GET', '/messages/api/all-messages', true)
    xhr.setRequestHeader('user-cookie', Cookies.get('token'))
    xhr.send(null);
  }
})