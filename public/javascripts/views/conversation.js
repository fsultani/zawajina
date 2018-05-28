const conversationId = window.location.pathname.split('/')[2]

let messagesArray = []
let replySection = undefined

const sendReply = () => {
  const replyText = document.getElementById('replyMessage').value
  axios.post('/messages/api/reply', {
    memberFirstName: Cookies.get('first_name'),
    memberId: Cookies.get('id'),
    conversationId: conversationId,
    reply: replyText
  })
  .then(function(res) {
    if (res.status === 201) {
      const reply = res.data.reply
      messagesArray.push(reply)

      const replyRow = (copy) => {
        return `
          <div class="col-md-6 col-md-offset-3" id="messageList">
            <div class="well">
              <div align="left">
                <div style="float: left"><p>You</p></div>
                <div style="float: right"><p>Unread</p></div>
                <div style="clear: both"></div>
                <div><p>${copy.message}</p></div>
              </div>
            </div>
          </div>
        `
      }

      if (messagesArray.length === 2) {
        const copy = messagesArray[1]
        replySection = replyRow(copy)
      } else if (messagesArray.length > 2) {
        const copy = messagesArray[messagesArray.length - 1]
        replySection += replyRow(copy)
      }
      document.getElementById('replyId').innerHTML = replySection
      document.getElementById('replyMessage').value = ' '
    } else {
      window.alert("Error")
    }
  })
}

window.addEventListener('load', () => {
  const url = window.location.pathname.split('/')
  if (url[1] === 'conversation' && url[2] === conversationId) {

    axios.get(`/conversation/api/${conversationId}`).then((res) => {
      messagesArray.push(res.data.messages)

      let messageList = `<center>`;
      messagesArray[0].map((message) => {
        messageList += `
          <div class="col-md-6 col-md-offset-3" id="messageList">
            <div class="well">
              <div align="left">`

          if (message.unread && Cookies.get("id") === message.to_user_id) {
            messageList += `
              <div><p>${message.from}</p></div>
              <div><b>${message.message}</b></div>
            `
            axios.put(`/messages/api/${conversationId}/${message._id}`, {
              unread: false
            }).then(res => {
              if (res.status === 201) {
                return
              }
            })
          } else if (!message.unread && Cookies.get("id") === message.to_user_id) {
            messageList += `
              <div><p>${message.from}</p></div>
              <div><p>${message.message}</p></div>
            `
          } else if (Cookies.get("id") === message.from_user_id) {
            messageList += `
              <div style="float: left"><p>You</p></div>
              <div style="float: right">${message.unread ? `Unread` : `Read`}</div>
              <div style="clear: both"></div>
              <div><p>${message.message}</p></div>
            `
          }
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

      messageList += `<div id="replyId"></div>`;
      messageList += `</center>`;

      const htmlOutput = authenticatedNavArea(Cookies.get('conversationCount')) + messageList + reply
      document.getElementById('my-app').innerHTML = htmlOutput;
    })
  } else if (url[1] === 'users' && url[3] === 'about') {
    
  }
})
