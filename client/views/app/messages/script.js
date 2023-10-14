const conversationId = window.location.pathname.split('/')[2];
const isMobileDevice = window.innerWidth <= 600;

let pageValue = 1;
let paginationApiWasCalled = false;
let hasMoreConversations = true;
let searchMessagesApiWasCalled = false;
let searchQuery = '';
let searchTextInput = '';

/* These characters are only used in the messages component, which allows anything to be sent. */
const htmlEscapeTags = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '\n': '<br>',
};

const escapeHtml = string => '' + string.replace(htmlRegExp, match => htmlEscapeTags[match]);

const fullPageLoadingSpinner = `
  <div class='full-page-loading-spinner'>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
`;

let mobilePageContent = `
  <div class='sidebar-conversations-container'>
    ${fullPageLoadingSpinner}
  </div>
`;

const desktopPageContent = `
  <div class='sidebar-conversations-container'>
    <div class='search-box-container'>
      <div class='search-box-wrapper'>
        <div class='form-group'>
          <input id='searchTextInput' type='text' class='form-control' name='searchText' placeholder='Search'>
          <span class='glyphicon glyphicon-search form-control-feedback'>
            <img src='/static/client/images/search_icon.png' />
          </span>
        </div>
      </div>
    </div>
    <div class='sidebar-conversations-wrapper'>
      ${fullPageLoadingSpinner}
    </div>
  </div>

  <div class='right-container'>
    <div class='conversation-wrapper'>
      <div class='chat-image-container'>
        <img src='/static/client/images/chat_icon.png' class='chat-image' />
      </div>
      <div class='bottom'></div>
    </div> 
  </div>
`;

const handleDeleteConversation = async (event, conversationId) => {
  event.stopPropagation();

  const seelctedConversation = getQuerySelector(`#conversation-menu-dropdown-conversationId-${conversationId}`).classList;
  seelctedConversation.remove('show-dropdown');

  const modalHeader = 'Delete conversation';
  const modalBody = '<h3>Confirm you want to delete this conversation.</h3>'
  const modalButton = 'Delete';

  showModal({
    modalHeader,
    modalBody,
    modalButton,
    submitFormCallback: async () => {
      try {
        const { data } = await Axios({
          method: 'put',
          apiUrl: `/messages/api/conversation/delete/${conversationId}`, // server/routes/messages.js
        });

        window.location.pathname = data.url;
      } catch (error) {
        toast('error', error.response?.data.message ?? 'There was an error')
      }
    }
  });
};

const renderSidebarConversationButton = conversation => (
  `
    <button
      class='sidebar-message-container conversationId-${conversation._id}'
      onclick='renderConversationWithState("${conversation._id}")'
    >
      <div class='sidebar-user-message-wrapper'>
        <p>${conversation.otherUser}</p>
        <p class='sidebar-message-preview ${conversation.lastMessageWasRead ? `read-message` : `unread-message`}'>${conversation.lastMessagePreview}</p>
      </div>

      <div class='sidebar-message-counter ${conversation.unreadMessagesCount > 0 ? 'counter-styles' : ''}' style='padding: 0 ${conversation.unreadMessagesCount > 9 ? 7 : 0}px'>
        <p>${conversation.unreadMessagesCount > 0 ? conversation.unreadMessagesCount : ''}</p>
      </div>

      <div class='sidebar-arrow-wrapper'>
        <span id='conversation-menu' class='sidebar-arrow-styles' onclick='handleConversationDropDown(event, "${conversation._id}")'></span>
      </div>

      <div class='conversation-menu-dropdown' id='conversation-menu-dropdown-conversationId-${conversation._id}'>
        <span id='delete' class='dropdown-item' style='cursor: pointer;' onclick='handleDeleteConversation(event, "${conversation._id}")'>
          Delete
        </span>
      </div>
    </button>
  `
);

const getSearchResults = async searchQuery => {
  try {
    const data = await Axios({
      apiUrl: `/messages/api/conversations/search?searchQuery=${searchQuery}`, // server/routes/messages.js
    });

    return data;
  } catch (error) {
    return error.response;
  }
};

const getUserSearchTextInput = () => (
  searchTextInput.addEventListener(
    'input',
    debounce(async () => {
      searchQuery = searchTextInput.value.trim();
      if (!searchQuery) {
        searchQuery = undefined;
        searchMessagesApiWasCalled = false;
        window.history.pushState({ conversationId: '' }, '', `/messages`)
        document.querySelector('.container').innerHTML = desktopPageContent;
        renderSidebar();
        return false;
      }

      const { searchMessages } = await getSearchResults(searchQuery);
      const searchMessagesResults = searchMessages.map(conversation => `
        <button class='sidebar-message-container conversationId-${conversation._id}' onclick='renderConversationWithState("${conversation._id}")'>
          <div class='sidebar-user-message-wrapper'>
            <p>${conversation.username}</p>
            <p class='sidebar-message-preview ${conversation.lastMessageWasRead ? `read-message` : `unread-message`}'>
              ${highlightSearchResults(conversation.message, searchQuery)}
            </p>
          </div>
          <p>${conversation.unreadMessagesCount > 0 ? conversation.unreadMessagesCount : ''}</p>
        </button>
      `).join('');

      document.querySelector('.sidebar-conversations-wrapper').innerHTML = searchMessagesResults;
      sidebarMessageContainerBorderBottom();
    }, 250)
  )
);

const handleSearchText = () => {
  searchTextInput.addEventListener('keyup', () => {
    if (!searchMessagesApiWasCalled) {
      getUserSearchTextInput()
      searchMessagesApiWasCalled = true;
    }
  });
};

const handleSendMessage = event => {
  event.preventDefault();
  const messageText = document.messageForm.elements.messageText.value.trim();

  /* Escaping the message just for the UI. */
  const messageTextEscapeHtml = escapeHtml(messageText);
  document.querySelector('[name=messageText]').value = '';

  const otherUserId = getQuerySelectorById('otherUserId').getAttribute('href').split('/')[2];

  const now = new Date();
  const messageDate = now.toLocaleDateString();

  const message = `
    <div class='user-one-container'>
      <div class='user-one-empty-div'>&nbsp;</div>
      <div class='user-one-wrapper'>
        <p class='user-message'>
          ${messageTextEscapeHtml}
        </p>
        <div class='message-time'>
          <p>${messageDate}&nbsp;-&nbsp;</p>
          <span class='delivery-status-sending'></span>
        </div>
      </div>
    </div>
  `;

  const chatContainer = document.querySelector('.chat-container');
  chatContainer.innerHTML += message;
  chatContainer.scrollTop = chatContainer.scrollHeight;

  /* Clear search input, and reset 'searchQuery' variable and styles. */
  if (searchTextInput) {
    searchTextInput.value = '';
    searchQuery = undefined;
  }
  document.querySelectorAll('.search-query-results').forEach(element => {
    element.style.backgroundColor = 'initial';
    element.style.fontWeight = 'initial';
  })

  /* Need to get the conversation ID again for certain usecases in the browser. */
  const conversationId = window.location.pathname.split('/')[2];
  Axios({
    method: 'post',
    apiUrl: '/messages/api/new-message', // server/routes/messages.js
    params: {
      conversationId,
      messageText,
      otherUserId,
    }
  })
    .then(({ data }) => {
      document.querySelector('[name=messageText]').focus();

      const allContainers = document.querySelectorAll('.message-time')
      const lastElement = allContainers[allContainers.length - 1]

      lastElement.innerHTML = `
      ${data.messageDate ?? ''}&nbsp;-&nbsp;
      <span class='delivery-status-delivered'></span>
      <span class='delivery-status-delivered'></span>
    `;

      const allConversationsSidebar = data.allConversationsSidebar.map(conversation => renderSidebarConversationButton(conversation)).join('');

      if (conversationId !== data.conversationId) {
        conversationId = data.conversationId;
        const pathname = `/messages/${conversationId}`;
        window.location.pathname = pathname;
        window.history.pushState({ conversationId }, '', pathname);
      }

      if (!isMobileDevice) {
        document.querySelector('.sidebar-conversations-wrapper').innerHTML = allConversationsSidebar;
        sidebarMessageContainerBorderBottom();

        document.querySelector('.sidebar-conversations-wrapper').scroll({
          top: 0,
          behavior: 'smooth',
        });

        highlightActiveConversation(conversationId);
      }
    })
    .catch(error => toast('error', error.response?.data.message ?? 'There was an error'))
};

const handleSidebarConversationsContainerScroll = () => {
  const sidebarConversationsContainer = document.querySelector('.sidebar-conversations-wrapper');
  sidebarConversationsContainer.addEventListener('scroll', () => {
    const scrollTopValue = sidebarConversationsContainer.scrollTop;
    const offsetHeightValue = sidebarConversationsContainer.offsetHeight;
    const scrollHeightValue = sidebarConversationsContainer.scrollHeight;

    const triggerApiCall = scrollTopValue + offsetHeightValue > (scrollHeightValue * 0.75);

    if (triggerApiCall && !paginationApiWasCalled && hasMoreConversations) {
      paginationApiWasCalled = true;
      pageValue += 1;

      Axios({
        apiUrl: `/messages/api/conversations?page=${pageValue}` // server/routes/messages.js
      })
        .then(data => {
          const allConversationsSidebar = data.allConversationsSidebar.map(conversation => renderSidebarConversationButton(conversation)).join('');

          document.querySelector('.sidebar-conversations-wrapper').innerHTML += allConversationsSidebar;
          sidebarMessageContainerBorderBottom();
          paginationApiWasCalled = false;
          hasMoreConversations = data.hasMoreConversations;
        });
    }
  }, false)
};

const highlightActiveConversation = conversationId => {
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

const handleConversationDropDown = (event, conversationId) => {
  event.stopPropagation();
  const srcElement = event.srcElement.id;

  const showDropdownClassName = 'show-dropdown';
  const seelctedConversation = getQuerySelector(`#conversation-menu-dropdown-conversationId-${conversationId}`).classList;

  if (srcElement === 'conversation-menu') {
    if (seelctedConversation.contains(showDropdownClassName)) {
      seelctedConversation.remove(showDropdownClassName);
    } else {
      document.querySelectorAll('.conversation-menu-dropdown').forEach(element => {
        element.classList.remove(showDropdownClassName);
      })

      seelctedConversation.add(showDropdownClassName);
    }
  } else {
    if (seelctedConversation.contains(showDropdownClassName)) {
      seelctedConversation.remove(showDropdownClassName);
    }
  }
};

const highlightSearchResults = (stringToSearch, searchQuery) => {
  const searchQueryRegex = new RegExp(escapeHtml(searchQuery), 'ig')
  return stringToSearch.replace(searchQueryRegex, x => `<span class='search-query-results'>${x}</span>`);
}

const renderConversationMessages = conversationId => {
  Axios({
    apiUrl: `/messages/api/conversation/${conversationId}` // server/routes/messages.js
  })
    .then(data => {
      const {
        authUser,
        otherUser,
        messages,
        blockedBy,
      } = data;

      const userInfoDiv = `
        <div class='user-info'>
          <h5>
            <a href='/user/${otherUser._id}' id='otherUserId'>
              ${otherUser.name}
              ${otherUser?.age}
              ${otherUser.city}, ${otherUser.state !== null ? `${otherUser.state}, ${otherUser.country}` : otherUser.country}
            </a>
          </h5>

          <div class='blocked-user-wrapper'>
            ${blockedBy?.authUser ? `<p class='blocked-user'>${blockedBy.authUser}</p>` : ''}
            ${blockedBy?.otherUser ? `<p class='blocked-user'>${blockedBy.otherUser}</p>` : ''}
          </div>
        </div>
        <div class='chat-container'></div>
      `;

      const conversationMessages = messages.map(message => {
        if (authUser._id === message.messageOtherUserId) {
          return `
            <div class='user-two-container'>
              <div class='user-two-wrapper'>
                <p class='user-message'>
                  ${searchQuery.length > 0 ? highlightSearchResults(message.messageText, searchQuery) : message.messageText}
                </p>
                <p class='message-time'>
                  ${message.messageDate ?? ''}
                </p>
              </div>
              <div class='user-two-empty-div'>&nbsp;</div>
            </div>
          `;
        } else {
          return `
            <div class='user-one-container'>
              <div class='user-one-empty-div'>&nbsp;</div>
              <div class='user-one-wrapper'>
                <p class='user-message'>
                  ${searchQuery.length > 0 ? highlightSearchResults(message.messageText, searchQuery) : message.messageText}
                </p>
                <div class='message-time'>
                  <p>${message.messageDate ?? ''}&nbsp;-&nbsp;</p>
                  ${message.read ? `
                    <span class='delivery-status-read'></span>
                    <span class='delivery-status-read'></span>
                    ` : `
                    <span class='delivery-status-delivered'></span>
                    <span class='delivery-status-delivered'></span>
                    `}
                </div>
              </div>
            </div>
            `;
        }
      }).join('');

      highlightActiveConversation(conversationId);

      if (isMobileDevice) {
        mobilePageContent = `
          <div class='sidebar-conversations-container'>
            <div class='conversation-wrapper'></div>
            <div class='input-container'>
              <div class='input-wrapper'>
                <form name='messageForm' class='message-form' onsubmit='handleSendMessage(event)' novalidate>
                  <textarea name='messageText' class='message-input'></textarea>
                  <button class='send-message-button'>Send</button>
                </form>
              </div>
            </div>
          </div>
        `;

        document.querySelector('.container').innerHTML = mobilePageContent;
        getQuerySelector('.conversation-wrapper').style.height = '100%';
      } else {
        getQuerySelector('.right-container').innerHTML += `
          <div class='input-container'>
            <div class='input-wrapper'>
              <form name='messageForm' class='message-form' onsubmit='handleSendMessage(event)' novalidate>
                <textarea name='messageText' class='message-input'></textarea>
                <button class='send-message-button'>Send</button>
              </form>
            </div>
          </div>
        `;

        getQuerySelector('.conversation-wrapper').style.height = 'auto';
      }

      document.querySelector('.conversation-wrapper').innerHTML = userInfoDiv;
      document.querySelector('.chat-container').innerHTML = conversationMessages + `<div class='bottom'></div>`;

      document.querySelector('.bottom').scrollIntoView(false);

      if (blockedBy) {
        const messageInput = getQuerySelector('.message-input')
        Object.assign(messageInput.style, {
          backgroundColor: '#f7f7f7',
        });

        document.querySelectorAll('form *').forEach(item => {
          item.disabled = true;
          Object.assign(item.style, {
            cursor: 'not-allowed',
          });
        });
      }
    })
    .catch(() => {
      window.history.pushState({ conversationId: '' }, '', `/messages`)
      renderSidebar();
    })
};

const renderConversationWithState = conversationId => {
  renderConversationMessages(conversationId);
  window.history.pushState({ conversationId }, '', `/messages/${conversationId}`)
};

const renderSidebar = () => {
  const loadingSpinner = document.querySelector('.full-page-loading-spinner');

  loadingSpinner.style.cssText = `display: inline-block`;

  if (searchMessagesApiWasCalled) {
    searchMessagesApiWasCalled = false;
  }

  Axios({
    apiUrl: `/messages/api/conversations?page=${pageValue}` // server/routes/messages.js
  }).then(data => {
    loadingSpinner.style.display = 'none';

    if (isMobileDevice) {
      if (data.allConversationsSidebar.length > 0) {
        const allConversationsSidebar = data.allConversationsSidebar.map(conversation => renderSidebarConversationButton(conversation)).join('');

        document.querySelector('.sidebar-conversations-container').innerHTML = `
          <div class='search-box-container'>
            <div class='search-box-wrapper'>
              <div class='form-group'>
                <input id='searchTextInput' type='text' class='form-control' name='searchText' placeholder='Search'>
                <span class='glyphicon glyphicon-search form-control-feedback'>
                  <img src='/static/client/images/search_icon.png' />
                </span>
              </div>
            </div>
          </div>
          <div class='chat-wrapper'>
            <div class='sidebar-conversations-wrapper'>${allConversationsSidebar}</div>
          </div>`;

        searchTextInput = document.querySelector('#searchTextInput');
        handleSearchText();
        sidebarMessageContainerBorderBottom();
        handleSidebarConversationsContainerScroll();

        /* Update the number of unread conversations in the top navbar */
        document.querySelector('.allConversationsCount').innerHTML = data.allConversationsCount > 0 ? `Messages (${data.allConversationsCount})` : 'Messages';
      } else {
        document.querySelector('.sidebar-conversations-container').innerHTML = `
          <div class='chat-image-container'>
            <img src='/static/client/images/chat_icon.png' class='chat-image' />
          </div>
          <div class='bottom'></div>
          <div class='sidebar-conversations-wrapper'></div>`;

        getQuerySelector('.conversation-wrapper').style.height = '100%';
      }
    } else {
      const allConversationsSidebar = data.allConversationsSidebar.map(conversation => renderSidebarConversationButton(conversation)).join('');

      document.querySelector('.sidebar-conversations-wrapper').innerHTML = allConversationsSidebar;

      searchTextInput = document.querySelector('#searchTextInput');
      handleSearchText();
      sidebarMessageContainerBorderBottom();

      /* Update the number of unread conversations in the top navbar */
      document.querySelector('.allConversationsCount').innerHTML = data.allConversationsCount > 0 ? `Messages (${data.allConversationsCount})` : 'Messages';
    }
  });
};

const sidebarMessageContainerBorderBottom = () => {
  const sidebarConversationsCount = document.querySelectorAll('.sidebar-message-container').length - 1;
  document.querySelectorAll('.sidebar-message-container').forEach((element, index) => {
    if (index < sidebarConversationsCount) {
      element.style.cssText = `border-bottom: solid 1px #ccc;`
    }
  });
};

document.addEventListener('click', () => {
  document.querySelectorAll('.conversation-menu-dropdown').forEach(element => {
    if (element.classList.contains('show-dropdown')) {
      element.classList.remove('show-dropdown');
    }
  })
});

window.onpopstate = function (event) {
  if (event.state?.conversationId) {
    const conversationId = event.state.conversationId;
    renderConversationMessages(conversationId);
  } else {
    const { pathname } = window.location;
    window.location.pathname = pathname;
  }
};

window.onload = () => {
  if (isMobileDevice) {
    document.querySelector('.container').innerHTML = mobilePageContent;
  } else {
    document.querySelector('.container').innerHTML = desktopPageContent;
    searchTextInput = document.querySelector('#searchTextInput');
    handleSearchText();
    handleSidebarConversationsContainerScroll();
  }

  if (conversationId) {
    renderConversationWithState(conversationId);

    if (pageValue === 1) {
      document.querySelector('.container').innerHTML = desktopPageContent;
      renderSidebar();
    }
  } else {
    window.history.pushState({ conversationId: '' }, '', `/messages`)
    renderSidebar();
  }
};
