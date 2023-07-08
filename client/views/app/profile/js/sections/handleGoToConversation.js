// const handleGoToConversation = userId => {
//   axios
//     .get(`/messages/api/conversation/user/${userId}`) // server/routes/messages.js
//     .then(({ data }) => {
//       window.location.pathname = data?.url;
//     })
//     .catch(error => {
//       console.log(`error\n`, error);
//     })
// };

const handleGoToConversation = userId => {
  Axios({
    apiUrl: `/messages/api/conversation/user/${userId}` // server/routes/messages.js
  })
    .then(({ url }) => {
      window.location.pathname = url;
    })
    .catch(error => {
      console.log(`error\n`, error);
    })
};