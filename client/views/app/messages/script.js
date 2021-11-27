const conversationIdPathname = window.location.pathname.split('/')[2];
const isMobileDevice = window.innerWidth <= 600;

let pageValue = 1;
let paginationApiWasCalled = false;
let hasMoreConversations = true;
let searchMessagesApiWasCalled = false;
let searchQueryRegex;
let searchTextInput;

let pageContent = `
  <div class="sidebar-conversations-container"></div>
`;

const highlightSearchResults = (stringToSearch, regexString) => stringToSearch.replace(regexString, x => `<span class="search-query-results">${x}</span>`);

const sidebarMessageContainerBorderBottom = () => {
  const sidebarConversationsCount = document.querySelectorAll('.sidebar-message-container').length - 1;
  document.querySelectorAll('.sidebar-message-container').forEach((element, index) => {
    if (index < sidebarConversationsCount) {
      element.style.cssText = `border-bottom: solid 1px #ccc;`
    }
  });
};

const highlightActiveConversation = ({ conversationId }) => {
  const allSidebarConversations = document.querySelectorAll('.sidebar-message-container');
  allSidebarConversations.forEach(item => {
    const hasId = item.className.includes(`conversationId-${conversationId}`);
    const conversationIdClassName = item.className.split(' ')[1]
    if (hasId) {
      document.querySelector(`.${conversationIdClassName}`).style.backgroundColor = '#eaeaea';
    } else {
      document.querySelector(`.${conversationIdClassName}`).style.backgroundColor = 'transparent';
    }
  })
};

const renderConversationMessages = ({ conversationId }) => {
  axios.get(`/messages/api/conversation/${conversationId}`).then(({ data }) => {
    const userInfo = data.recipient;

    const userInfoDiv = `
      <div class="user-info">
        <h5>
          <a href="/user/${userInfo._id}">
            ${userInfo.name}
            ${userInfo.age || '(Missing Age)'}
            ${userInfo.city}, ${userInfo.state !== null ? `${userInfo.state}, ${userInfo.country}` : userInfo.country})
          </a>
        </h5>
      </div>
      <div class="chat-container"></div>
    `;

    const messages = data.messages.map(message => {
      if (data.authUser._id === data.createdByUser._id) {
        if (data.createdByUser._id === message.sender) {
          return `
              <div class="user-one-container">
                <div class="user-one-empty-div">&nbsp;</div>
                <div class="user-one-wrapper">
                  <p class="user-message">
                    ${searchQueryRegex === undefined ? message.messageText : highlightSearchResults(message.messageText, searchQueryRegex)}
                  </p>
                  <div class="message-time">
                    <p>${message.messageDate}&nbsp;-&nbsp;</p>
                    <p class='${message.read ? `delivery-status-read` : `delivery-status-delivered`}'>${message.read ? `Read` : `Delivered`}</p>
                  </div>
                </div>
              </div>
              `
        } else {
          return `
              <div class="user-two-container">
                <div class="user-two-wrapper">
                  <p class="user-message">
                    ${searchQueryRegex === undefined ? message.messageText : highlightSearchResults(message.messageText, searchQueryRegex)}
                  </p>
                  <p class="message-time">
                    ${message.messageDate}
                  </p>
                </div>
                <div class="user-two-empty-div">&nbsp;</div>
              </div>
            `
        }
      } else {
        if (data.createdByUser._id === message.sender) {
          return `
              <div class="user-two-container">
                <div class="user-two-wrapper">
                  <p class="user-message">
                    ${searchQueryRegex === undefined ? message.messageText : highlightSearchResults(message.messageText, searchQueryRegex)}
                  </p>
                  <p class="message-time">
                    ${message.messageDate}
                  </p>
                </div>
                <div class="user-two-empty-div">&nbsp;</div>
              </div>
            `
        } else {
          return `
              <div class="user-one-container">
                <div class="user-one-empty-div">&nbsp;</div>
                <div class="user-one-wrapper">
                  <p class="user-message">
                    ${searchQueryRegex === undefined ? message.messageText : highlightSearchResults(message.messageText, searchQueryRegex)}
                  </p>
                  <div class="message-time">
                    <p>${message.messageDate}&nbsp;-&nbsp;</p>
                    <p class='${message.read ? `delivery-status-read` : `delivery-status-delivered`}'>${message.read ? `Read` : `Delivered`}</p>
                  </div>
                </div>
              </div>
            `
        }
      }
    }).join('');

    highlightActiveConversation({ conversationId });

    if (isMobileDevice) {
      pageContent = `
      <div class="sidebar-conversations-container">
        <div class="conversation-wrapper"></div>
        <div class="input-container">
          <div class="input-wrapper">
            <form name="messageForm" class="message-form" onsubmit="handleSendMessage(event)" novalidate>
              <textarea name="messageText" class="message-input"></textarea>
              <button class="send-message-button">Send</button>
            </form>
          </div>
        </div>
      </div>
    `;

      document.querySelector('.container').innerHTML = pageContent;
    }

    document.querySelector('.conversation-wrapper').innerHTML = userInfoDiv;
    document.querySelector('.chat-container').innerHTML = messages + '<div class="bottom"></div>';
    document.querySelector('.bottom').scrollIntoView(false);
  })
}

const renderConversationWithState = (conversationId) => {
  if (isMobileDevice) {
    renderConversationMessages({ conversationId })
    window.history.pushState({ conversationId }, '', `/messages/${conversationId}`)
  } else {
    renderConversationMessages({ conversationId })
    window.history.pushState({ conversationId }, '', `/messages/${conversationId}`)
    if (pageValue === 1) {
      renderAllConversationsSidebar();
    }
  }
}

const renderAllConversationsSidebar = () => {
  if (searchQueryRegex === undefined) {
    axios.get(`/messages/api/conversations?page=${pageValue}`).then(({ data }) => {
      if (isMobileDevice) {
        if (data.allConversationsSidebar.length > 0) {
          const allConversationsSidebar = data.allConversationsSidebar.map(conversation => `
            <button
              class="sidebar-message-container conversationId-${conversation._id}"
              onclick="renderConversationWithState('${conversation._id}')"
            >
              <div class="sidebar-user-message-wrapper">
                <p class="sidebar-info">${conversation.otherUser}</p>
                <p class="sidebar-message-preview ${conversation.lastMessageWasRead ? `read-message` : `unread-message`}">${conversation.lastMessagePreview}</p>
              </div>
              <p class="sidebar-info">${conversation.unreadMessagesCount > 1 ? conversation.unreadMessagesCount : ''}</p>
            </button>
          `).join('');

          document.querySelector('.sidebar-conversations-container').innerHTML = `
            <div class="search-box-container">
              <div class="search-box-wrapper">
                <div class="form-group">
                  <input id="searchTextInput" type="text" class="form-control" name="searchText" placeholder="Search">
                  <span class="glyphicon glyphicon-search form-control-feedback">
                    <img src="/static/client/images/search_icon.png" />
                  </span>
                </div>
              </div>
            </div>
            <div class="chat-wrapper">
              <div class="sidebar-conversations-wrapper">${allConversationsSidebar}</div>
            </div>`;

          searchTextInput = document.querySelector('#searchTextInput');
          handleSearchText();
          sidebarMessageContainerBorderBottom();
          handleSidebarConversationsContainerScroll();

          /* Update the number of unread conversations in the top navbar */
          document.querySelector('.allConversationsCount').innerHTML = data.allConversationsCount > 0 ? `Messages (${data.allConversationsCount})` : 'Messages';
        } else {
          document.querySelector('.sidebar-conversations-container').innerHTML = `
            <div class="chat-image-container">
              <img src="/static/client/images/chat_icon.png" class="chat-image" />
            </div>
            <div class="bottom"></div>
            <div class="sidebar-conversations-wrapper"></div>`;
        }
      } else {
        const allConversationsSidebar = data.allConversationsSidebar.map(conversation => `
          <button
            class="sidebar-message-container conversationId-${conversation._id}"
            onclick="renderConversationWithState('${conversation._id}')"
          >
            <div class="sidebar-user-message-wrapper">
              <p class="sidebar-info">${conversation.otherUser}</p>
              <p class="sidebar-message-preview ${conversation.lastMessageWasRead ? `read-message` : `unread-message`}">${conversation.lastMessagePreview}</p>
            </div>
            <p class="sidebar-info">${conversation.unreadMessagesCount > 1 ? conversation.unreadMessagesCount : ''}</p>
          </button>
        `).join('');

        document.querySelector('.sidebar-conversations-wrapper').innerHTML = allConversationsSidebar;
        sidebarMessageContainerBorderBottom();

        /* Update the number of unread conversations in the top navbar */
        document.querySelector('.allConversationsCount').innerHTML = data.allConversationsCount > 0 ? `Messages (${data.allConversationsCount})` : 'Messages';
      }
    });
  }
};

const handleMessageInput = () => {
  const messageInput = document.querySelector('.message-input')
  messageInput.addEventListener('input', e => {
    e.target.style.height = '40px';
    e.target.style.height = `${e.target.scrollHeight + 2}px`;
  })
};

const handleSearchText = () => {
  searchTextInput.addEventListener('keydown', () => {
    if (!searchMessagesApiWasCalled) {
      getUserSearchTextInput()
      searchMessagesApiWasCalled = true;
    }
  });
};

const handleSendMessage = event => {
  event.preventDefault();
  const messageText = document.messageForm.elements.messageText.value;
  const conversationId = window.location.pathname.split('/')[2]
  document.querySelector('[name=messageText]').value = '';

  const now = new Date();
  const messageDate = now.toLocaleDateString()

  const message = `
    <div class="user-one-container">
      <div class="user-one-empty-div">&nbsp;</div>
      <div class="user-one-wrapper">
        <p class="user-message">
          ${messageText}
        </p>
        <div class="message-time">
          <p>${messageDate}&nbsp;-&nbsp;</p>
          <p class='delivery-status'>Sending</p>
        </div>
      </div>
    </div>
  `;

  const chatContainer = document.querySelector('.chat-container')
  chatContainer.innerHTML += message;
  chatContainer.scrollTop = chatContainer.scrollHeight;

  /**
   * Clear search input, and reset searchQueryRegex variable and styles
   */
  if (searchTextInput) {
    searchTextInput.value = '';
    searchQueryRegex = undefined;
  }
  document.querySelectorAll('.search-query-results').forEach(element => {
    element.style.backgroundColor = 'initial';
    element.style.fontWeight = 'initial';
  })

  axios.post('/messages/api/new-message', {
    conversationId,
    messageText,
  }).then(({ data }) => {
    document.querySelector('[name=messageText]').focus();

    const allContainers = document.querySelectorAll('.message-time')
    const lastElement = allContainers[allContainers.length - 1]

    lastElement.innerHTML = `${data.messageDate}&nbsp;-&nbsp;<p class='delivery-status'>Delivered</p>`;

    const allConversationsSidebar = data.allConversations.map(conversation => `
      <button class="sidebar-message-container conversationId-${conversation._id}" onclick="renderConversationWithState('${conversation._id}')">
        <div class="sidebar-user-message-wrapper">
          <p class="sidebar-info">${conversation.otherUser}</p>
          <p class="sidebar-message-preview ${conversation.lastMessageWasRead ? `read-message` : `unread-message`}">${conversation.lastMessagePreview}</p>
        </div>
        <p class="sidebar-info">${conversation.unreadMessagesCount > 1 ? conversation.unreadMessagesCount : ''}</p>
      </button>
    `).join('');

    if (!isMobileDevice) {
      document.querySelector('.sidebar-conversations-wrapper').innerHTML = allConversationsSidebar;
      sidebarMessageContainerBorderBottom();
  
      document.querySelector('.sidebar-conversations-wrapper').scroll({
        top: 0,
        behavior: 'smooth',
      });
  
      highlightActiveConversation({ conversationId })
    }
  })
};

const getSearchResults = async searchQuery => {
  try {
    const data = await FetchData('/messages/api/conversations/search', {
      params: {
        searchQuery,
      },
    });
    return data;
  } catch (error) {
    return error.response;
  }
};

const getUserSearchTextInput = () =>
  searchTextInput.addEventListener(
    'input',
    debounce(async () => {
      const searchQuery = searchTextInput.value;
      if (!searchQuery) {
        searchQueryRegex = undefined;
        searchMessagesApiWasCalled = false;
        window.history.pushState({ conversationId: '' }, '', `/messages`)
        renderAllConversationsSidebar();
        return false;
      }

      searchQueryRegex = new RegExp(searchQuery, 'ig')
      const { searchMessages } = await getSearchResults(searchQuery);
      const searchMessagesResults = searchMessages.map(conversation => `
        <button class="sidebar-message-container conversationId-${conversation._id}" onclick="renderConversationWithState('${conversation._id}')">
          <div class="sidebar-user-message-wrapper">
            <p class="sidebar-info">${highlightSearchResults(conversation.username, searchQueryRegex)} - <code><em>${conversation._id}</em></code></p>
            <p class="sidebar-message-preview ${conversation.lastMessageWasRead ? `read-message` : `unread-message`}">
              ${highlightSearchResults(conversation.message, searchQueryRegex)}
            </p>
          </div>
          <p class="sidebar-info">${conversation.unreadMessagesCount > 1 ? conversation.unreadMessagesCount : ''}</p>
        </button>
      `).join('');

      document.querySelector('.sidebar-conversations-wrapper').innerHTML = searchMessagesResults;
      sidebarMessageContainerBorderBottom();
    }, 250)
  );

const handleSidebarConversationsContainerScroll = () => {
  const sidebarConversationsContainer = document.querySelector('.sidebar-conversations-wrapper');
  sidebarConversationsContainer.addEventListener('scroll', () => {
    const scrollTopValue = sidebarConversationsContainer.scrollTop;
    const offsetHeightValue = sidebarConversationsContainer.offsetHeight;
    const scrollHeightValue = sidebarConversationsContainer.scrollHeight;

    const triggerApiCall = scrollTopValue + offsetHeightValue > (scrollHeightValue * 0.75);

    if (triggerApiCall && !paginationApiWasCalled && hasMoreConversations) {
      paginationApiWasCalled = true;
      pageValue = pageValue + 1;
      axios.get(`/messages/api/conversations?page=${pageValue}`).then(({ data }) => {
        const allConversationsSidebar = data.allConversationsSidebar.map(conversation => `
        <button class="sidebar-message-container conversationId-${conversation._id}" onclick="renderConversationWithState('${conversation._id}')">
          <div class="sidebar-user-message-wrapper">
            <p class="sidebar-info">${conversation.otherUser} - ${conversation._id}</p>
            <p class="sidebar-message-preview ${conversation.lastMessageWasRead ? `read-message` : `unread-message`}">${conversation.lastMessagePreview}</p>
          </div>
          <p class="sidebar-info">${conversation.unreadMessagesCount > 1 ? conversation.unreadMessagesCount : ''}</p>
        </button>
      `).join('');

        document.querySelector('.sidebar-conversations-wrapper').innerHTML += allConversationsSidebar;
        sidebarMessageContainerBorderBottom();
        paginationApiWasCalled = false;
        hasMoreConversations = data.hasMoreConversations;
      });
    }
  }, false)
};

window.onpopstate = function (event) {
  const { pathname } = window.location;

  if (event?.state?.conversationId) {
    renderConversationMessages({ conversationId: event.state.conversationId })
  } else {
    window.location.pathname = pathname;
  }
};

(() => {
  if (isMobileDevice) {
    document.querySelector('.container').innerHTML = pageContent;
  } else {
    pageContent = `
      <div class="sidebar-conversations-container">
        <div class="search-box-container">
          <div class="search-box-wrapper">
            <div class="form-group">
              <input id="searchTextInput" type="text" class="form-control" name="searchText" placeholder="Search">
              <span class="glyphicon glyphicon-search form-control-feedback">
                <img src="/static/client/images/search_icon.png" />
              </span>
            </div>
          </div>
        </div>
        <div class="sidebar-conversations-wrapper"></div>
      </div>

      <div class="right-container">
        <div class="conversation-wrapper">
          <div class="chat-image-container">
            <img src="/static/client/images/chat_icon.png" class="chat-image" />
          </div>
          <div class="bottom"></div>
        </div>

        <div class="input-container">
          <div class="input-wrapper">
            <form name="messageForm" class="message-form" onsubmit="handleSendMessage(event)" novalidate>
              <textarea name="messageText" class="message-input"></textarea>
              <button class="send-message-button">Send</button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.querySelector('.container').innerHTML = pageContent;
    searchTextInput = document.querySelector('#searchTextInput');
    handleSearchText();
    handleSidebarConversationsContainerScroll();
  }

  if (conversationIdPathname) {
    renderConversationWithState(conversationIdPathname)
  } else {
    window.history.pushState({ conversationId: '' }, '', `/messages`)
    renderAllConversationsSidebar();
  }
})();
