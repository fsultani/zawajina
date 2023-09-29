const handleLikeUser = userId => {
  axios
    .put('/api/user/like', {
      userId,
    })
    .then(({ data }) => {
      const likeButton = getQuerySelector('.like-button');
      const userIsLiked = data.userIsLiked;

      likeButton.style.cssText = `
        background-color: ${userIsLiked ? '#ffffff' : '#008cff'};
        color: ${userIsLiked ? '#008cff' : '#ffffff'};
        border: ${userIsLiked ? 'solid 1px #008cff' : 'transparent'};
      `;

      if (userIsLiked) {
        toast('success', `You liked ${data.userName}!`);
      }
    })
    .catch(error => {
      console.log(`error\n`, error);
    });
};
