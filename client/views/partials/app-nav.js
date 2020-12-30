// (async () => {
//   const response = await axios.get(`/user/api/user-photo`, {
//     headers: {
//       Authorization: Cookies.get("token"),
//     },
//   });

//   const { authUserId, authUserProfilePhoto } = response.data;

//   document.querySelector(`.profile-menu-loader`).style.display = 'none';
//   document.querySelector(`.user-avatar-menu`).src = authUserProfilePhoto;
//   document.querySelector(`.user-avatar-menu`).style.display = 'flex';
//   document.querySelector(`a[href='#profile']`).href = `/user/${authUserId}`;
// })();
