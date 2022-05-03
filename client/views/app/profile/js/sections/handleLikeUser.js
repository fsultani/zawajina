const handleLikeUser = userId => {
  axios
    .put('/user', {
      userId,
    })
    .then(({ data }) => {
      const likeButton = document.querySelector('.like-button');
      const userIsLiked = data.userIsLiked;

      likeButton.style.cssText = `
        background-color: ${userIsLiked ? '#ffffff' : '#008cff'};
        color: ${userIsLiked ? '#008cff' : '#ffffff'};
        border: ${userIsLiked ? 'solid 1px #008cff' : 'transparent'};
      `;

      if (userIsLiked) {
        globalThis.toast('success', `You liked ${data.userName}!`);
      }
    })
    .catch(error => {
      console.log(`error\n`, error);
    });
};
