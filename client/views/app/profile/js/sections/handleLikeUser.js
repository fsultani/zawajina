const handleLikeUser = memberId => {
  axios
    .put('/api/user/like', {
      memberId,
    })
    .then(({ data }) => {
      const likeButton = document.querySelector('.like-button');
      const userIsLiked = data.userIsLiked;

      likeButton.style.cssText = `
        background-color: ${userIsLiked ? '#ffffff' : 'var(--color-green);'};
        color: ${userIsLiked ? 'var(--color-green);' : '#ffffff'};
        border: ${userIsLiked ? 'solid 1px var(--color-green);' : 'transparent'};
      `;

      if (userIsLiked) {
        toast('success', `You liked ${data.userName}!`);
      }
    })
    .catch(error => {
      console.log(`error\n`, error);
    });
};
