const handleGoToConversation = userId => {
  axios
    .get(`/messages/api/conversation/user/${userId}`)
    .then(({ data: { conversationId } }) => {
      window.location.pathname = `/messages/${conversationId}`;
    })
    .catch(error => {
      console.log(`error\n`, error);
    })
};
