const blockUser = getQuerySelector('#block-user');

const handleBlockUser = (memberId, memberName) => {
  const modalHeader = `Block ${memberName}`;
  const modalBody = `<h3>Confirm you want to block ${memberName}.</h3>`
  const modalButton = 'Block';

  showModal({
    modalHeader,
    modalBody,
    modalButton,
    submitFormCallback: async () => {
      Axios({
        method: 'put',
        apiUrl: '/api/user/block', // server/routes/user/api.js
        params: { memberId },
      })
        .then(() => {
          window.location.pathname = '/users';
        })
        .catch(() => {
          toast('error', 'There was an error');
        });
    }
  });
};
