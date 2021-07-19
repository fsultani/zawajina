// const checkAuthentication = async () => {
//   try {
//     const isAuthenticated = await axios.get('/api/authenticate', {
//       headers: {
//         Authorization: Cookies.get('my_match_authToken'),
//       },
//     });
//     return isAuthenticated.status;
//   } catch (err) {
//     console.log('err:\n', err);
//     return err.response;
//   }
// };

// (async () => {
//   const checkAuthenticationStatus = await checkAuthentication();
//   console.log('checkAuthenticationStatus:\n', checkAuthenticationStatus);
//   if (checkAuthenticationStatus === 201) {
//     console.log(`Good to go`);
//     return;
//   } else {
//     console.log(`Not allowed`);
//     Cookies.remove('my_match_authToken');
//     window.location.assign('/login');
//   }
// })();
