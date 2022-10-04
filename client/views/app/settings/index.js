(() => {
  const pathname = window.location.pathname;
  getQuerySelector('body').style.backgroundColor = '#f7f7f7';

  switch (pathname) {
    case '/settings/account':
      getQuerySelector('#account-page').classList.add('active');
      getQuerySelector('#account').style.display = 'block';
      break;
    case '/settings/blocked':
      getQuerySelector('#blocked-users-page').classList.add('active');
      getQuerySelector('#blocked-users').style.display = 'block';
      break;
    case '/settings/security':
      getQuerySelector('#security-page').classList.add('active');
      getQuerySelector('#security').style.display = 'block';
      break;
    default:
      break;
  }

  const usernameValue = getQuerySelector('.name').dataset.name;
  getQuerySelector('.name').value = usernameValue;
})();
