(() => {
  getQuerySelector('body').style.backgroundColor = '#f7f7f7';

  const likeButton = getQuerySelector('.like-button');
  const userIsLiked = likeButton.getAttribute('data-user-is-liked') === 'true';

  Object.assign(likeButton.style, {
    backgroundColor: userIsLiked ? '#ffffff' : 'var(--color-green)',
    color: userIsLiked ? 'var(--color-green)' : '#ffffff',
    border: userIsLiked ? 'solid 1px var(--color-green)' : 'transparent',
  });

  const pathname = window.location.pathname
  if (pathname === '/profile') {
    const contactWrapper = document.querySelector('.contact-wrapper')
    const children = contactWrapper.querySelectorAll(':scope > button');

    children.forEach(element => {
      Object.assign(element.style, {
        pointerEvents: 'none',
      });
    })
  }
})();
