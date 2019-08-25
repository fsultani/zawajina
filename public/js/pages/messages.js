window.addEventListener('load', () => {
  if (window.location.pathname === '/messages' && Cookies.get('token')) {
    axios.get('/messages/api/all-messages').then(res => {
      const lastMessage = res.data.lastMessage
      if (lastMessage) {
        let memberInfo = `
          <center>
            <h2 class="dashboard-text">Your messages</h2>
        `;
        lastMessage.map((message) => {
          const truncatedMessage = message.lastMessage.message.length <+ 150 ?
            `${message.lastMessage.message}`
            : `${message.lastMessage.message.substring(0, 150)}...`

          if (message.lastMessage.to_user_id !== Cookies.get('id')) {
            memberInfo += `
              <a href="/conversation/${message._id}">
                <div class="col-md-6 col-md-offset-3" style="padding: 10px">
                  <div class="messageContainer">
                    <div><p>${message.lastMessage.to}</p></div>
                    <div>
                      <p>You: ${truncatedMessage}</p>
                    </div>
                  </div>
                </div>
              </a>
            `;
          } else {
            memberInfo += `
              <a href="/conversation/${message._id}">
                <div class="col-md-6 col-md-offset-3" style="padding: 10px">
                  <div class="messageContainer">
                    <div><p>${message.lastMessage.from}</p></div>
                    <div>
                      ${message.lastMessage.unread ?
                      `<p style="font-weight: 700">${truncatedMessage}</p>` :
                      `<p>${truncatedMessage}</p>`}
                    </div>
                  </div>
                </div>
              </a>
            `;
          }
        })
        memberInfo += `</a></center>`

        const htmlOutput = authenticatedNavArea(Cookies.get('conversationCount')) + memberInfo
        document.getElementById('my-app').innerHTML = htmlOutput;
      } else {
        let memberInfo = `
          <center>
            <h2 class="dashboard-text">No messages</h2>
          </center>
        `;

        let htmlOutput = authenticatedNavArea(Cookies.get('conversationCount')) + memberInfo
        document.getElementById('my-app').innerHTML = htmlOutput;
      }
    })
  }
})
