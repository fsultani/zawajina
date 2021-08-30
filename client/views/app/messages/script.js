const conversationId = window.location.pathname.split('/')[2];

const handleClick = (conversationId) => window.location.pathname = `/messages/${conversationId}`;

(() => {
  axios.get(`/messages/api/conversations`).then(({ data }) => {

    const allConversationsSidebar = data.allConversationsSidebar.map(conversation => `
      <button class="sidebar-message-container" onclick="handleClick('${conversation._id}')">
        <div class="sidebar-user-message-wrapper">
          <p class="sidebar-info">${conversation.otherUser}</p>
          ${conversation.lastMessageWasRead ?
        `<p class="sidebar-message-preview">${conversation.lastMessagePreview}</p>`
        :
        `<p class="sidebar-message-preview-unread">${conversation.lastMessagePreview}</p>`
      }
        </div>
        <p class="sidebar-info">${conversation.unreadMessagesCount > 0 ? conversation.unreadMessagesCount : ''}</p>
      </button>
    `).join('');

    document.querySelector('.sidebar-conversations-container').innerHTML = allConversationsSidebar;
  })

  if (conversationId) {
    axios
      .get(`/messages/api/conversation/${conversationId}`)
      .then(({ data }) => {
        const messages = data.messages.map(message => {
          if (data.authUser._id === data.createdByUser._id) {
            if (data.createdByUser._id === message.sender) {
              return `
                <div class="user-one-container">
                  <div class="user-one-wrapper">
                    <p class="user-message">
                      ${message.messageText}
                    </p>
                    <p class="message-time">
                      ${message.timeStamp}&nbsp;-&nbsp;
                      ${message.read ?
                        `<span>Read</span>`
                        :
                        `<span>Delivered</span>`
                      }
                    </p>
                  </div>
                </div>
                `
            } else {
              return `
                <div class="user-two-container">
                  <p class="user-message">
                    ${message.messageText}
                  </p>
                  <p class="message-time">
                    ${message.timeStamp}
                  </p>
                </div>
              `
            }
          } else {
            if (data.createdByUser._id === message.sender) {
              return `
                <div class="user-two-container">
                  <p class="user-message">
                    ${message.messageText}
                  </p>
                  <p class="message-time">
                    ${message.timeStamp}
                  </p>
                </div>
              `
            } else {
              return `
                <div class="user-one-container">
                  <div class="user-one-wrapper">
                    <p class="user-message">
                      ${message.messageText}
                    </p>
                    <p class="message-time">
                      ${message.timeStamp}&nbsp;-&nbsp;
                      ${message.read ?
                        `<span>Read</span>`
                        :
                        `<span>Delivered</span>`
                      }
                    </p>
                  </div>
                </div>
              `
            }
          }
        }).join('')
        document.querySelector('.chat-container').innerHTML = messages + '<div class="bottom"></div>';
        document.querySelector('.bottom').scrollIntoView(false);
      })
      .catch(error => {
        console.log(`error\n`, error);
      })
  }
})();

const messageInput = document.querySelector('.message-input')
messageInput.addEventListener('input', e => {
  e.target.style.height = '40px';
  e.target.style.height = `${e.target.scrollHeight + 2}px`;
})

const handleSendMessage = event => {
  event.preventDefault();
  const messageText = document.messageForm.elements.messageText.value;
  const conversationId = window.location.pathname.split('/')[2]
  document.querySelector('[name=messageText]').value = '';

  const message = `
    <div class="user-one-container">
      <div class="user-one-wrapper">
        <p class="user-message">
          ${messageText}
        </p>
        <p class="message-time">
          <span>Sending</span>
        </p>
      </div>
    </div>
  `

  const chatContainer = document.querySelector('.chat-container')
  chatContainer.innerHTML += message;
  chatContainer.scrollTop = chatContainer.scrollHeight;

  axios.post('/messages/api/new-message', {
    conversationId,
    messageText,
  }).then(({ data }) => {
    document.querySelector('[name=messageText]').focus();

    const allContainers = document.querySelectorAll('.message-time')
    const lastElement = allContainers[allContainers.length - 1]

    lastElement.innerHTML = `${data.timeStamp}&nbsp;-&nbsp;<span>Delivered</span>`;
  })
};
