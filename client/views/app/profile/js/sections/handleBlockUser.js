const blockUser = getQuerySelector('#block-user');

const handleBlockUser = userId => {
  Axios({
    method: 'put',
    apiUrl: '/api/user/block', // server/routes/user/api.js
    params: { userId },
  })
    .then(({ data }) => {
      const { message, userIsBlocked } = data;
      toast('success', message);
      blockUser.innerHTML = userIsBlocked ? 'Unblock' : 'Block';
    })
    .catch(() => {
      toast('error', 'There was an error');
    });
};

window.onload = () => {
  const pathname = window.location.pathname
  if (pathname !== '/profile') {
    const userIsBlocked = blockUser.dataset.userIsBlocked === 'true';
    blockUser.innerHTML = userIsBlocked ? 'Unblock' : 'Block';
  }
}
