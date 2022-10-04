(() => {
  getQuerySelector('body').style.backgroundColor = '#f7f7f7';

  const likeButton = getQuerySelector('.like-button');
  const userIsLiked = likeButton.getAttribute('data-user-is-liked') === 'true';

  Object.assign(likeButton.style, {
    backgroundColor: userIsLiked ? '#ffffff' : '#008cff',
    color: userIsLiked ? '#008cff' : '#ffffff',
    border: userIsLiked ? 'solid 1px #008cff' : 'transparent',
  });
})();
