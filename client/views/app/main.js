(() => {
  const { referrer } = document;
  if (referrer) {
    const isConversation = referrer.split('/').slice(-2, -1)[0] === 'messages';
    if (isConversation) {
      const conversationId = referrer.split('/').slice(-1)[0];
      axios.delete(`/messages/api/conversation/delete/${conversationId}`)
    }
  }
})();
