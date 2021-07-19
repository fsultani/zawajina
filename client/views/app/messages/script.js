const conversationId = window.location.pathname.split('/')[2];

const handleClick = (conversationId) => window.location.pathname = `/messages/${conversationId}`;

(() => {
  axios.get(`/messages/api/conversations`).then(({ data }) => {

    const allConversations = data.allConversations.map(conversation => `
      <button class="sidebar-message-container" onclick="handleClick('${conversation._id}')">
        <div class="sidebar-user-message-wrapper">
          <p class="sidebar-info">${conversation.otherUser}</p>
          ${conversation.lastMessageWasRead ?
            `<p class="sidebar-message-preview">${conversation.lastMessagePreview}</p>`
            :
            `<p class="sidebar-message-preview-unread">${conversation.lastMessagePreview}</p>`
          }
        </div>
        <p class="sidebar-info">${conversation.allUnreadMessagesCount}</p>
      </button>
    `).join('');

    document.querySelector('.sidebar-conversations-container').innerHTML = allConversations;
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
                      ${message.time}
                      ${message.read ?
                        `
                          <span class="checkmark-one"></span>
                          <span class="checkmark-two"></span>
                        `
                      :
                        `<span class="checkmark-one"></span>`
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
                    ${message.time}
                    ${message.read ?
                      `
                        <span class="checkmark-one"></span>
                        <span class="checkmark-two"></span>
                      `
                    :
                      `<span class="checkmark-one"></span>`
                    }
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
                    ${message.time}
                    ${message.read ?
                      `
                        <span class="checkmark-one"></span>
                        <span class="checkmark-two"></span>
                      `
                    :
                      `<span class="checkmark-one"></span>`
                    }
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
                      ${message.time}
                      ${message.read ?
                        `
                          <span class="checkmark-one"></span>
                          <span class="checkmark-two"></span>
                        `
                      :
                        `<span class="checkmark-one"></span>`
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

  axios.post('/messages/api/new-message', {
    conversationId,
    messageText,
  }).then(({ data }) => {
    console.log(`data\n`, data);
    document.querySelector('[name=messageText]').value = '';
    document.querySelector('[name=messageText]').focus();
    document.querySelector('.bottom').scrollIntoView(false);

    const messages = data.messages.map(message => {
      if (data.authUser._id === data.createdByUser._id) {
        if (data.createdByUser._id === message.sender) {
          return `
              <div class="user-one-container">
                <div class="user-one-wrapper">
                  <p class="user-message">
                    ${message.messageText}
                  </p>
                  <p class="message-time">${message.time}
                    <span class="checkmark-one"></span>
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
                <p class="message-time">${message.time}
                  <span class="checkmark-one"></span>
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
                <p class="message-time">${message.time}
                  <span class="checkmark-one"></span>
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
                  <p class="message-time">${message.time}
                    <span class="checkmark-one"></span>
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
};
