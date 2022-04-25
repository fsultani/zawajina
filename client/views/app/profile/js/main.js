const profileId = window.location.pathname.split('/')[2];

const container = getQuerySelector('.container');
const userId = container.getAttribute('data-user-id');

if (profileId === userId) {
  disableOptions();
  editProfile();
}
