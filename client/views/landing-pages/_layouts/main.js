setTimeout(() => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  // Display slow network message for non Safari users after 5 seconds
  if (connection) {
    const type = connection.effectiveType;
    if (type === '2g' || type === '3g') {
      formMessage('error', `Looks like you're on a slow network. Data may take longer to load.`);
    }
  }
}, 1000);

const openNav = () => {
  getQuerySelector('.side-menu-mobile').style.width = '150px';
};

const closeNav = () => {
  getQuerySelector('.side-menu-mobile').style.width = 0;
};

document.addEventListener('click', event => {
  const hrefValue = event.target.getAttribute('href');
  const hrefArrayOfValues = ['/#about', '/#pricing'];
  const targetName = event.target.classList.value;

  if (
    targetName !== 'open-nav' &&
    targetName !== 'side-menu-mobile' &&
    hrefArrayOfValues.indexOf(hrefValue) > -1
  ) {
    closeNav();
  }
});

(async () => {
  try {
    const mainContent = getQuerySelector('.main-content');
    const pathnames = ['/', '/privacy-policy', '/terms'];

    if (pathnames.includes(window.location.pathname)) {
      Object.assign(mainContent.style, {
        display: 'flex',
        height: '100%'
      })
    } else {
      Object.assign(mainContent.style, {
        display: 'flex',
        height: '100vh',
        justifyContent: 'space-between',
      })
    }

    // Do not call the API from the login page since that page removes all cookies
    if (window.location.pathname !== '/login') await Axios({ apiUrl: '/' })
  } catch (error) {
    if (error.response.status === 403) {
      document.body.innerHTML = error.response.data ?? 'Error';
    }
  }
})();
