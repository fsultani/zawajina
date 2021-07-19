let documentReady = false;

const loader = display => {
  document.querySelector('body').style.backgroundColor = display ? 'rgba(0,0,0,0.5)' : '#ffffff';
  document.querySelector('body').style.opacity = display ? 0.5 : 1;
  document.querySelector('body').style.position = 'relative';
  document.querySelector('.full-page-loading-spinner').style.display = display
    ? 'inline-block'
    : 'none';
};

setTimeout(() => {
  if (!documentReady) {
    loader(true);
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  setTimeout(() => {
    // Display slow network message for non Safari users after 5 seconds
    if (connection) {
      const type = connection.effectiveType;
      if (type === '2g' || type === '3g') {
        document.querySelector('#slow-network-warning').style.display = 'block';
        document.querySelector('#slow-network-warning').innerHTML = `
          <p>Looks like you're on a slow network.</p>
          <p>Data may take longer to load.</p>
        `;
      }
    }
  }, 5000);

  setTimeout(() => {
    // Display message if data is not loaded after 10 seconds
    if (!documentReady) {
      document.querySelector('#slow-network-warning').style.display = 'block';
      document.querySelector('#slow-network-warning').innerHTML = `
        <p>Data is taking longer than expected to load.</p>
      `;
    }
  }, 10000);
}, 1000);

// axios.get('/register/api/signup-user-first-name', {
//   headers: {
//     userId: Cookies.get('my_match_userId'),
//   },
// }).then(res => {
//   if (res.data.message === 'Token Sent') {
//     window.location.pathname = '/verify-email';
//   }
//   documentReady = true;
//   loader(false);
//   document.querySelector('#slow-network-warning').style.display = 'none';
//   document.querySelector('.form-title').innerHTML = `Welcome, ${res.data.name}`;
// }).catch(err => {
//   if (err instanceof TypeError) {
//     console.error(err);
//   } else {
//     Cookies.remove('my_match_authToken');
//     Cookies.remove('my_match_userId');
//     window.location.pathname = '/signup';
//   }
// });

axios.get('/register/api/signup-user-first-name').then(res => {
  if (res.data.message === 'Token Sent') {
    window.location.pathname = '/verify-email';
  }
  documentReady = true;
  loader(false);
  document.querySelector('#slow-network-warning').style.display = 'none';
  document.querySelector('.form-title').innerHTML = `Welcome, ${res.data.name}`;
}).catch(err => {
  if (err instanceof TypeError) {
    console.error(err);
  } else {
    Cookies.remove('my_match_authToken');
    Cookies.remove('my_match_userId');
    window.location.pathname = '/signup';
  }
});