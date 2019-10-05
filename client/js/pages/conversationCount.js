const userId = Cookies.get("id") ? Cookies.get("id") : null

axios.get(`/conversation/api/totalCount/${userId}`).then(res => {
  const fromUserId = []
  res.data.messages.map(message => {
    if (!fromUserId.includes(message.from_user_id)) {
      fromUserId.push(message.from_user_id)
    } else {
      return
    }
  })
  Cookies.set('conversationCount', fromUserId.length)
})
