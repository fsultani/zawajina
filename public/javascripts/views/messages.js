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

        conversationCount.then(res => {
          let htmlOutput = authenticatedNavArea(res.data.conversationTotal) + memberInfo
          document.getElementById('my-app').innerHTML = htmlOutput;
        })
      } else {
        let memberInfo = `
          <center>
            <h2 class="dashboard-text">No messages</h2>
          </center>
        `;

        conversationCount.then(res => {
          let htmlOutput = authenticatedNavArea(res.data.conversationTotal) + memberInfo
          document.getElementById('my-app').innerHTML = htmlOutput;
        })
      }
    })
  }
})
