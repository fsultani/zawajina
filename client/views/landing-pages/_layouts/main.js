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
  const mainContent = getQuerySelector('.main-content');
  const pathnames = ['/', '/privacy-policy', '/terms'];

  if (mainContent) {
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
  }

  const now = new Date();
  const year = now.getFullYear();
  getQuerySelectorById('copyrightText').innerHTML = `&copy;&nbsp;${year} Zawajina. All rights reserved.`
})();
