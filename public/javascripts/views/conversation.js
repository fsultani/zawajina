const conversationId = window.location.pathname.split('/')[2]

let htmlOutput = beginLayout + authenticated + endLayout

const sendReply = () => {
  const reply = document.getElementById('replyMessage').value
  axios.post('/messages/api/reply', {
    memberFirstName: Cookies.get('first_name'),
    memberId: Cookies.get('id'),
    conversationId: conversationId,
    reply: reply
  })
  .then(function(res) {
    if (res.status === 201) {
      window.location.reload(true)
    }
  })
}

window.addEventListener('load', () => {
  const url = window.location.pathname.split('/')
  if (url[1] === 'conversation' && url[2] === conversationId) {
    axios.get(`/conversation/api/${conversationId}`).then((res) => {
      const messages = res.data.messages

      let messageList = `<center>`;
      messages.map((message) => {
        messageList += `
          <div class="col-md-6 col-md-offset-3" id="messageList">
            <div class="well">
              <div align="left">`

          message.unread ? (
            messageList += `
              <div style="float: left">${message.from}: <b>${message.message}</b></div>
              <div style="float: right">Unread</div>
              <div style="clear: both"></div>
            `
            ) : (
            messageList += `
              <div style="float: left">${message.from}: ${message.message}</div>
              <div style="float: right">Read</div>
              <div style="clear: both"></div>
            `
            )
          messageList += `</div></div></div>`;
      })

      const reply = `
        <div id="contactForm">
          <div class="form-group col-md-6 col-md-offset-3">
            <center>
              <textarea class="form-control" id="replyMessage" rows="5" cols="10"></textarea>
              <br />
              <button class="btn btn-primary" onclick="sendReply()">Send</button>
            </center>
          </div>
        </div>
      `;

      messageList += `</center>`;

      htmlOutput += messageList + reply
      document.getElementById('my-app').innerHTML = htmlOutput;
    })
  } else if (url[1] === 'users' && url[3] === 'about') {
    
  }
})
