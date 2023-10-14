window.onload = () => {
  const pathname = window.location.pathname;
  getQuerySelector('body').style.backgroundColor = '#f7f7f7';

  const navContainer = getQuerySelector('.nav-container');
  navContainer.innerHTML = `
    <nav class="nav nav-borders">
      <a class="nav-link" id="account-page" href="/settings/account">Account</a>
      <a class="nav-link" id="password-page" href="/settings/password">Password</a>
      <a class="nav-link" id="blocked-users-page" href="/settings/blocked">Blocked Users</a>
    </nav>
    <hr class="horizontal-divider">
  `;

  switch (pathname) {
    case '/settings/account':
      getQuerySelector('#account-page').classList.add('active');
      getQuerySelector('#account').style.display = 'flex';
      break;
    case '/settings/blocked':
      getQuerySelector('#blocked-users-page').classList.add('active');
      getQuerySelector('#blocked-users').style.display = 'block';
      break;
    case '/settings/password':
      getQuerySelector('#password-page').classList.add('active');
      getQuerySelector('#password').style.display = 'block';
      break;
    default:
      break;
  }
}

const handleUnblockUser = (memberId, memberName) => {
  const modalHeader = `Unblock ${memberName}`;
  const modalBody = `<h3>Confirm you want to unblock ${memberName}.</h3>`
  const modalButton = 'Unblock';

  showModal({
    modalHeader,
    modalBody,
    modalButton,
    submitFormCallback: async () => {
      Axios({
        method: 'put',
        apiUrl: '/api/user/unblock', // server/routes/user/api.js
        params: { memberId },
      })
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          toast('error', 'There was an error');
        });
    }
  });
};
