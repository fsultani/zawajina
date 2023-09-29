const handleGoToConversation = userId => {
  Axios({
    apiUrl: `/messages/api/conversation/user/${userId}` // server/routes/messages.js
  })
    .then(({ url }) => {
      if (url) window.location.pathname = url;
    })
    .catch(error => {
      console.log(`error\n`, error);
    })
};
