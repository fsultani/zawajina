const messagesLayout = `
  <div class="container">
    <div class="row">
      <div class="header clearfix">
        <nav style="padding-top: 10px">
          <ul class="nav nav-pills pull-left">
            <li role="presentation">
              <a href="/home">
                <h3>My App <br>
                <h5>(${Cookies.get('first_name')})</h5>
                </h3>
              </a>
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
    axios.get('/messages/api/all-messages').then(res => {
      const conversations = res.data.conversations
      if (conversations) {
        let memberInfo = `
          <center>
            <h2 class="dashboard-text">Your messages</h2>
        `;
        conversations.map((conversation) => {
          if (conversation.sent_to_user_id !== Cookies.get('id')) {
            memberInfo += `
              <a href="/conversation/${conversation._id}">
                <div class="col-md-6 col-md-offset-3">
                  <div class="well">
                    <div>${conversation.sent_to_user_first_name}</div>
                  </div>
                </div>
              </a>
            `;
          } else {
            memberInfo += `
              <a href="/conversation/${conversation._id}">
                <div class="col-md-6 col-md-offset-3">
                  <div class="well">
                    <div>${conversation.created_by_user_first_name}</div>
                  </div>
                </div>
              </a>
            `;
          }
        })
        memberInfo += `</a></center>`
        const htmlOutput = messagesLayout + memberInfo
        document.getElementById('my-app').innerHTML = htmlOutput
      } else {
        let memberInfo = `
          <center>
            <h2 class="dashboard-text">No messages</h2>
          </center>
        `;
        const htmlOutput = profilePageLayout + memberInfo
        document.getElementById('my-app').innerHTML = htmlOutput
      }
    })
  }
})
