const profileId = window.location.pathname.split('/')[2];

const container = getQuerySelector('.container');
const userId = container.getAttribute('data-user-id');

if (profileId === userId) {
  disableOptions();
  editProfile();
}

(() => {
  const likeButton = document.querySelector('.like-button');
  const userIsLiked = likeButton.getAttribute('data-user-is-liked') === 'true';

  likeButton.style.cssText = `
    background-color: ${userIsLiked ? '#ffffff' : '#008cff'};
    color: ${userIsLiked ? '#008cff' : '#ffffff'};
    border: ${userIsLiked ? 'solid 1px #008cff' : 'transparent'};
  `;
})();
